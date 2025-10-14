'use server';

import { revalidateGiftRelatedCaches } from '@/app/_actions/gifts';
import { getSession } from '@/app/auth';
import db from '@/lib/db/client';

export const joinWishlist = async (wishlistId: string, pin?: string) => {
  try {
    const { user } = await getSession();

    // Get the wishlist to check its password
    const wishlist = await db.wishlist.findUnique({
      where: { id: wishlistId },
      select: { password: true },
    });

    if (!wishlist) {
      return { error: 'Wishlist not found' };
    }

    // Only validate pin if the wishlist has a password
    if (wishlist.password) {
      if (!pin) {
        return { error: 'Pin is required to join this wishlist' };
      }

      // Validate pin format
      if (!/^\d{4}$/.test(pin)) {
        return { error: 'Pin must be 4 digits' };
      }

      if (wishlist.password !== pin) {
        return { error: 'Invalid pin' };
      }
    }

    await db.wishlist.update({
      where: { id: wishlistId },
      data: {
        members: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    revalidateGiftRelatedCaches();
    return { success: true, message: 'Successfully joined wishlist' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
};

export const leaveWishlist = async (wishlistId: string) => {
  try {
    const { user } = await getSession();
    await db.wishlist.update({
      where: { id: wishlistId },
      data: {
        members: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });
    revalidateGiftRelatedCaches();
    return { success: true, message: 'Successfully left wishlist' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
};

export const handleWishlistAction = async (
  wishlistId: string,
  isMember: boolean,
  pin?: string,
) => {
  if (isMember) {
    return leaveWishlist(wishlistId);
  }

  return joinWishlist(wishlistId, pin);
};
