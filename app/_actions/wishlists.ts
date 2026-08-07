'use server';

import { z } from 'zod';
import { defineAction } from '@/lib/actions/define';
import db from '@/lib/db/client';

const WISHLIST_CACHES = ['gifts', 'users', 'wishlists'] as const;

/**
 * Leaving is the only way out of a Family, and an Invite is the only way in
 * (ADR-0005). There is deliberately no join action here: the one that existed
 * compared a four-digit plaintext shared secret, unthrottled, and a correct
 * guess handed over every member's address and sizes.
 */
export const leaveWishlist = defineAction(
  { input: z.string().min(1), invalidates: WISHLIST_CACHES },
  async ({ viewer, input: familyId }) => {
    // Keyed by the pair, so this both scopes and acts: a viewer can only ever
    // delete their own edge, and leaving one they are not in is a no-op rather
    // than an error worth telling them apart from success.
    await db.membership.deleteMany({
      where: { familyId, userId: viewer.id },
    });
    return { message: 'Successfully left wishlist' };
  },
);
