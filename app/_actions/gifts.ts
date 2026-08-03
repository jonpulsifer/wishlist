'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { ActionError, defineAction } from '@/lib/actions/define';
import { editableGiftWhere } from '@/lib/db/authority';
import db from '@/lib/db/client';
import { visibleProfileWhere } from '@/lib/db/visibility';

// Reached from the invite route handler as well as from actions, so this stays
// on `revalidateTag` — `updateTag` is only legal inside a Server Action.
export const revalidateGiftRelatedCaches = async () => {
  revalidateTag('gifts', 'max');
  revalidateTag('users', 'max');
  revalidateTag('wishlists', 'max');
};

const GIFT_CACHES = ['gifts', 'users', 'wishlists'] as const;

const GiftSchema = z.object({
  recipientId: z.string().min(1, 'Recipient is required'),
  name: z.string().min(1, 'Gift name is required'),
  url: z.url().optional().or(z.literal('')),
  description: z.string().optional(),
});

export type GiftFormData = z.infer<typeof GiftSchema>;

const giftIdSchema = z.object({ id: z.string().min(1, 'Gift ID is required') });

/**
 * Load a Gift the viewer is allowed to change, or throw.
 *
 * Owner-or-creator was written out four times across this file, each with its
 * own copy of the same message. The rule itself now lives in
 * `lib/db/authority.ts`, so a Gift the viewer may not touch is never loaded —
 * and "not yours" and "not there" are one answer, which is the one that does
 * not confirm a uuid exists.
 */
async function loadEditableGift(giftId: string, viewerId: string) {
  const gift = await db.gift.findFirst({
    where: { id: giftId, ...editableGiftWhere(viewerId) },
    select: {
      id: true,
      name: true,
      archived: true,
      ownerId: true,
      createdById: true,
    },
  });

  if (!gift) throw new ActionError('Gift not found');
  return gift;
}

export const addGift = defineAction(
  { input: GiftSchema, invalidates: GIFT_CACHES },
  async ({ viewer, input }) => {
    // `recipientId` is client state, so it is re-derived here rather than
    // trusted: the picker is scoped by `visiblePeopleWhere`, but an action is a
    // POST endpoint and a uuid is all it takes to reach this one.
    const recipient = await db.user.findFirst({
      where: visibleProfileWhere(viewer.id, input.recipientId),
      select: { id: true },
    });
    if (!recipient) throw new ActionError('Recipient not found');

    // Nothing reads this pin any more — visibility follows the subject. It is
    // still written so the old rule's inputs stay intact and a revert of that
    // step is one commit rather than a restore. It goes with the table.
    //
    // The recipient's Wishlists, not the adder's, which is what the old rule
    // meant: resolving these from the viewer shared the Gift with groups the
    // recipient may not even be in, and withheld it from the ones they are.
    const wishlists = await db.wishlist.findMany({
      select: { id: true },
      where: { members: { some: { id: input.recipientId } } },
    });

    await db.gift.create({
      data: {
        name: input.name,
        url: input.url,
        description: input.description,
        owner: { connect: { id: input.recipientId } },
        createdBy: { connect: { id: viewer.id } },
        wishlists: { connect: wishlists.map(({ id }) => ({ id })) },
      },
    });

    return { message: `${input.name} has been added to the wishlist.` };
  },
);

export const deleteGift = defineAction(
  { input: z.string().min(1, 'Gift ID is required'), invalidates: GIFT_CACHES },
  async ({ viewer, input: id }) => {
    const gift = await loadEditableGift(id, viewer.id);
    await db.gift.delete({ where: { id } });
    return { message: `${gift.name} has been deleted` };
  },
);

export const archiveGift = defineAction(
  { input: z.string().min(1, 'Gift ID is required'), invalidates: GIFT_CACHES },
  async ({ viewer, input: id }) => {
    const gift = await loadEditableGift(id, viewer.id);
    if (gift.archived) throw new ActionError('Gift is already archived');

    await db.gift.update({ where: { id }, data: { archived: true } });
    return { message: `${gift.name} has been archived` };
  },
);

export const unarchiveGift = defineAction(
  { input: z.string().min(1, 'Gift ID is required'), invalidates: GIFT_CACHES },
  async ({ viewer, input: id }) => {
    const gift = await loadEditableGift(id, viewer.id);
    if (!gift.archived) throw new ActionError('Gift is not archived');

    // Unarchiving also releases any claim: the gift is going back on the list
    // as available.
    await db.$transaction([
      db.claimer.deleteMany({ where: { wishId: id } }),
      db.gift.update({
        where: { id },
        data: {
          archived: false,
          claimed: false,
          claimedBy: { disconnect: true },
        },
      }),
    ]);
    return { message: `${gift.name} has been unarchived` };
  },
);

export const updateGift = defineAction(
  {
    input: giftIdSchema.extend({
      name: z.string().min(1, 'Gift name is required'),
      description: z.string(),
      url: z.string(),
    }),
    invalidates: GIFT_CACHES,
  },
  async ({ viewer, input }) => {
    await loadEditableGift(input.id, viewer.id);
    await db.gift.update({
      where: { id: input.id },
      data: {
        name: input.name,
        url: input.url,
        description: input.description,
      },
    });
    return { message: `${input.name} has been updated` };
  },
);

/**
 * Claiming writes both shapes.
 *
 * `Claimer` is what the reads consume; `Gift.claimed` and `Gift.claimedById`
 * are still written so a revert of this step resumes the old rule exactly.
 * Both columns leave in the step that drops them, and these two writes go with
 * them.
 */
export const claimGift = defineAction(
  { input: z.string().min(1, 'Gift ID is required'), invalidates: GIFT_CACHES },
  async ({ viewer, input: id }) => {
    const gift = await db.gift.findUnique({
      where: { id },
      select: {
        name: true,
        ownerId: true,
        claimers: { select: { userId: true } },
      },
    });

    if (!gift) throw new ActionError('Gift not found');
    if (gift.claimers.length > 0)
      throw new ActionError('This gift has already been claimed');
    if (gift.ownerId === viewer.id)
      throw new ActionError('You cannot claim your own gift');

    await db.$transaction([
      db.claimer.create({ data: { wishId: id, userId: viewer.id } }),
      db.gift.update({
        where: { id },
        data: { claimed: true, claimedBy: { connect: { id: viewer.id } } },
      }),
    ]);
    return { message: `You claimed ${gift.name}` };
  },
);

export const unclaimGift = defineAction(
  { input: z.string().min(1, 'Gift ID is required'), invalidates: GIFT_CACHES },
  async ({ viewer, input: id }) => {
    const gift = await db.gift.findUnique({
      where: { id },
      select: {
        name: true,
        claimers: { where: { userId: viewer.id }, select: { userId: true } },
      },
    });

    if (!gift) throw new ActionError('Gift not found');
    if (gift.claimers.length === 0) {
      throw new ActionError('You have not claimed this gift');
    }

    await db.$transaction([
      db.claimer.delete({
        where: { wishId_userId: { wishId: id, userId: viewer.id } },
      }),
      db.gift.update({
        where: { id },
        data: { claimed: false, claimedBy: { disconnect: true } },
      }),
    ]);
    return { message: `You unclaimed ${gift.name}` };
  },
);
