'use server';

import { z } from 'zod';
import { ActionError, defineAction } from '@/lib/actions/define';
import db from '@/lib/db/client';

const WISHLIST_CACHES = ['gifts', 'users', 'wishlists'] as const;

const pinSchema = z
  .string()
  .regex(/^\d{4}$/, 'Pin must be 4 digits')
  .optional();

export const joinWishlist = defineAction(
  {
    input: z.object({ wishlistId: z.string().min(1), pin: pinSchema }),
    invalidates: WISHLIST_CACHES,
  },
  async ({ viewer, input: { wishlistId, pin } }) => {
    const wishlist = await db.wishlist.findUnique({
      where: { id: wishlistId },
      select: { password: true },
    });

    if (!wishlist) throw new ActionError('Wishlist not found');

    if (wishlist.password) {
      if (!pin) throw new ActionError('Pin is required to join this wishlist');
      if (wishlist.password !== pin) throw new ActionError('Invalid pin');
    }

    await db.wishlist.update({
      where: { id: wishlistId },
      data: { members: { connect: { id: viewer.id } } },
    });

    return { message: 'Successfully joined wishlist' };
  },
);

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
