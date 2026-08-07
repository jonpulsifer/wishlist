'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { ActionError, defineAction } from '@/lib/actions/define';
import { editableWishWhere, subjectOfWhere } from '@/lib/db/authority';
import db from '@/lib/db/client';
import { visibleProfileWhere } from '@/lib/db/visibility';
import type { Prisma } from '@/prisma/generated/client';

// Reached from the invite route handler as well as from actions, so this stays
// on `revalidateTag` — `updateTag` is only legal inside a Server Action.
export const revalidateGiftRelatedCaches = async () => {
  revalidateTag('gifts', 'max');
  revalidateTag('users', 'max');
  revalidateTag('wishlists', 'max');
};

const GIFT_CACHES = ['gifts', 'users', 'wishlists'] as const;

/** One thing, wanted once, unless the subject says otherwise. */
const quantitySchema = z.coerce
  .number()
  .int('A whole number, please')
  .min(1, 'At least one')
  .max(99, 'At most 99');

const GiftSchema = z.object({
  recipientId: z.string().min(1, 'Recipient is required'),
  name: z.string().min(1, 'Gift name is required'),
  quantity: quantitySchema.optional(),
  url: z.url().optional().or(z.literal('')),
  description: z.string().optional(),
  /**
   * Typing someone's list in *for* them rather than suggesting *to* them: the
   * proposer recorded is the subject, so the Wish lands on their own list where
   * they can see it. Suggesting is the default, and it stays a surprise.
   */
  asSubject: z.boolean().optional(),
});

export type GiftFormData = z.infer<typeof GiftSchema>;

const giftIdSchema = z.object({ id: z.string().min(1, 'Gift ID is required') });

/**
 * Load a Wish the viewer holds the given authority over, or throw.
 *
 * The authority comes in as a `where` rather than being judged after the row is
 * loaded, so a Wish the viewer may not touch is never loaded — and "not yours"
 * and "not there" are one answer, which is the one that does not confirm a uuid
 * exists.
 */
async function loadWish(id: string, authority: Prisma.WishWhereInput) {
  const wish = await db.wish.findFirst({
    where: { id, ...authority },
    select: { id: true, name: true, archived: true },
  });

  if (!wish) throw new ActionError('Gift not found');
  return wish;
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

    await db.wish.create({
      data: {
        name: input.name,
        url: input.url,
        description: input.description,
        quantity: input.quantity ?? 1,
        subject: { connect: { id: recipient.id } },
        proposer: {
          connect: { id: input.asSubject ? recipient.id : viewer.id },
        },
      },
    });

    return { message: `${input.name} has been added to the wishlist.` };
  },
);

export const deleteGift = defineAction(
  { input: z.string().min(1, 'Gift ID is required'), invalidates: GIFT_CACHES },
  async ({ viewer, input: id }) => {
    // Deleting is how a proposer withdraws a Suggestion, so it stays open to
    // both people.
    const wish = await loadWish(id, editableWishWhere(viewer.id));
    await db.wish.delete({ where: { id } });
    return { message: `${wish.name} has been deleted` };
  },
);

export const archiveGift = defineAction(
  { input: z.string().min(1, 'Gift ID is required'), invalidates: GIFT_CACHES },
  async ({ viewer, input: id }) => {
    // Only the subject archives. A proposer archiving their own Suggestion
    // would strand the row where nobody — themselves included — can reach it.
    const wish = await loadWish(id, subjectOfWhere(viewer.id));
    if (wish.archived) throw new ActionError('Gift is already archived');

    await db.wish.update({ where: { id }, data: { archived: true } });
    return { message: `${wish.name} has been archived` };
  },
);

export const unarchiveGift = defineAction(
  { input: z.string().min(1, 'Gift ID is required'), invalidates: GIFT_CACHES },
  async ({ viewer, input: id }) => {
    const wish = await loadWish(id, subjectOfWhere(viewer.id));
    if (!wish.archived) throw new ActionError('Gift is not archived');

    // Unarchiving also releases any claim: the gift is going back on the list
    // as available.
    await db.$transaction([
      db.claimer.deleteMany({ where: { wishId: id } }),
      db.wish.update({ where: { id }, data: { archived: false } }),
    ]);
    return { message: `${wish.name} has been unarchived` };
  },
);

export const updateGift = defineAction(
  {
    input: giftIdSchema.extend({
      name: z.string().min(1, 'Gift name is required'),
      description: z.string(),
      url: z.string(),
      quantity: quantitySchema.optional(),
    }),
    invalidates: GIFT_CACHES,
  },
  async ({ viewer, input }) => {
    await loadWish(input.id, editableWishWhere(viewer.id));
    await db.wish.update({
      where: { id: input.id },
      data: {
        name: input.name,
        url: input.url,
        description: input.description,
        ...(input.quantity ? { quantity: input.quantity } : {}),
      },
    });
    return { message: `${input.name} has been updated` };
  },
);

/**
 * Speak for some of a Wish.
 *
 * A Wish may be wanted several times over — five pairs of socks — so claiming is
 * not a flag but an amount, and "is this taken?" is the sum of what everyone has
 * spoken for. Several people going in on one thing is several rows and nothing
 * else: no share, no amount of money, no price.
 *
 * The Wish row is locked for the duration, because the whole point of claiming
 * is that two people cannot buy the same thing. Without the lock both viewers
 * read the same sum, both find room, and both insert — READ COMMITTED gives
 * each of them a snapshot taken before the other wrote. A guard written as one
 * `INSERT ... WHERE (SELECT SUM(...))` reads exactly the same way and is no
 * safer; only the lock serialises them.
 */
export const claimGift = defineAction(
  {
    input: z.object({
      id: z.string().min(1, 'Gift ID is required'),
      quantity: quantitySchema.optional(),
    }),
    invalidates: GIFT_CACHES,
  },
  async ({ viewer, input: { id, quantity = 1 } }) => {
    return db.$transaction(async (tx) => {
      // `FOR UPDATE` on the Wish makes every claimer of it queue here. Returns
      // no rows for an id that does not exist, which is the same answer as a
      // Wish the viewer may not reach.
      const [wish] = await tx.$queryRaw<
        Array<{ name: string; quantity: number; subjectId: string }>
      >`SELECT "name", "quantity", "subjectId" FROM "Wish" WHERE "id" = ${id}::uuid FOR UPDATE`;

      if (!wish) throw new ActionError('Gift not found');
      if (wish.subjectId === viewer.id)
        throw new ActionError('You cannot claim your own gift');

      const claimers = await tx.claimer.findMany({
        where: { wishId: id },
        select: { userId: true, quantity: true },
      });

      if (claimers.some((c) => c.userId === viewer.id))
        throw new ActionError('You have already claimed this gift');

      const spokenFor = claimers.reduce((total, c) => total + c.quantity, 0);
      if (spokenFor + quantity > wish.quantity) {
        throw new ActionError(
          wish.quantity > 1
            ? 'There are not that many left to claim'
            : 'This gift has already been claimed',
        );
      }

      await tx.claimer.create({
        data: { wishId: id, userId: viewer.id, quantity },
      });

      return { message: `You claimed ${wish.name}` };
    });
  },
);

export const unclaimGift = defineAction(
  { input: z.string().min(1, 'Gift ID is required'), invalidates: GIFT_CACHES },
  async ({ viewer, input: id }) => {
    const wish = await db.wish.findUnique({
      where: { id },
      select: {
        name: true,
        claimers: { where: { userId: viewer.id }, select: { userId: true } },
      },
    });

    if (!wish) throw new ActionError('Gift not found');
    if (wish.claimers.length === 0) {
      throw new ActionError('You have not claimed this gift');
    }

    await db.claimer.delete({
      where: { wishId_userId: { wishId: id, userId: viewer.id } },
    });
    return { message: `You unclaimed ${wish.name}` };
  },
);
