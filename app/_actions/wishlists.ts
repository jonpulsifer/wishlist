'use server';

import { z } from 'zod';
import { defineAction } from '@/lib/actions/define';
import db from '@/lib/db/client';

const WISHLIST_CACHES = ['gifts', 'users', 'wishlists'] as const;

/**
 * Leaving is the only way out of a Wishlist, and an Invite is the only way in
 * (ADR-0005). There is deliberately no join action here: the one that existed
 * compared a four-digit plaintext shared secret, unthrottled, and a correct
 * guess handed over every member's address and sizes.
 */
export const leaveWishlist = defineAction(
  { input: z.string().min(1), invalidates: WISHLIST_CACHES },
  async ({ viewer, input: wishlistId }) => {
    await db.wishlist.update({
      where: { id: wishlistId },
      data: { members: { disconnect: { id: viewer.id } } },
    });
    return { message: 'Successfully left wishlist' };
  },
);
