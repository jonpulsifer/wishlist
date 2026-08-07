'use server';

import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { ActionError, defineAction } from '@/lib/actions/define';
import { memberOfWhere } from '@/lib/db/authority';
import db from '@/lib/db/client';
import { inviteExpiryFrom } from '@/lib/invites';

const FAMILY_CACHES = ['gifts', 'users', 'wishlists'] as const;

const familyIdSchema = z.string().uuid('Invalid family');

/**
 * Open a Family, with yourself in it.
 *
 * No capability: there is nothing to grant. A Family you are the only member of
 * discloses nothing to anyone, and an Invite is the only way that changes
 * (ADR-0005) — so the act that used to need `manage:wishlists` needs a session
 * and nothing else.
 */
export const createFamily = defineAction(
  {
    input: z.object({
      name: z.string().trim().min(1, 'Name is required').max(255),
    }),
    invalidates: FAMILY_CACHES,
  },
  async ({ viewer, input }) => {
    const family = await db.family.create({
      data: {
        name: input.name,
        memberships: { create: { userId: viewer.id } },
      },
    });
    return { id: family.id, message: `${family.name} has been created` };
  },
);

/**
 * Leave a Family — the only exit there is.
 *
 * Membership is a **ratchet**: nobody may remove anyone, which is what lets an
 * Invite be handed out by every member rather than by an administrator. The
 * last member leaving takes the Family with them, because a Family with nobody
 * in it is invisible to everyone and reachable by nothing.
 */
export const leaveWishlist = defineAction(
  { input: familyIdSchema, invalidates: FAMILY_CACHES },
  async ({ viewer, input: familyId }) => {
    // Keyed by the pair, so this both scopes and acts: a viewer can only ever
    // delete their own edge.
    const { count } = await db.membership.deleteMany({
      where: { familyId, userId: viewer.id },
    });
    if (!count) throw new ActionError('You are not in that family');

    const remaining = await db.membership.count({ where: { familyId } });
    if (remaining === 0) await db.family.delete({ where: { id: familyId } });

    return { message: 'Successfully left wishlist' };
  },
);

function generateInviteToken() {
  // 24 bytes => 32 chars in base64url-ish alphabet, good entropy for share links.
  return randomBytes(24)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

/**
 * Mint an Invite to a Family you are in.
 *
 * Any member may: a family whose members cannot invite anyone grows only as
 * fast as its admin answers messages (ADR-0005). What makes that affordable is
 * that the link is single-use and expiring, so one handed to the wrong person
 * costs a single wrong member rather than a group chat's worth.
 *
 * The previous link is revoked, so there is one live link per Family at a time.
 */
export const createInvite = defineAction(
  { input: familyIdSchema, invalidates: FAMILY_CACHES },
  async ({ viewer, input: familyId }) => {
    const family = await db.family.findFirst({
      where: { id: familyId, ...memberOfWhere(viewer.id) },
      select: { id: true },
    });
    if (!family) throw new ActionError('Family not found');

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const token = generateInviteToken();
      try {
        await db.$transaction([
          db.invite.updateMany({
            where: { familyId: family.id, revokedAt: null, redeemedAt: null },
            data: { revokedAt: new Date() },
          }),
          db.invite.create({
            data: {
              token,
              expiresAt: inviteExpiryFrom(),
              family: { connect: { id: family.id } },
              createdBy: { connect: { id: viewer.id } },
            },
          }),
        ]);
        return { token, message: 'Invite link created' };
      } catch {
        // Extremely unlikely token collision; retry a few times.
      }
    }

    throw new ActionError('Failed to create invite link. Please try again.');
  },
);
