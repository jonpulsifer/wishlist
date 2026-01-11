'use server';

import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { revalidateGiftRelatedCaches } from '@/app/_actions/gifts';
import { getSession, isWishlistAdmin } from '@/app/auth';
import db from '@/lib/db/client';

const WishlistPinSchema = z.string().regex(/^\d{4}$/, 'Pin must be 4 digits');

const CreateWishlistSchema = z.object({
  name: z.string().trim().min(1, 'Wishlist name is required').max(255),
  pin: WishlistPinSchema,
});

const UpdateWishlistPinSchema = z.object({
  wishlistId: z.string().min(1, 'Wishlist ID is required'),
  pin: WishlistPinSchema,
});

const DeleteWishlistSchema = z.object({
  wishlistId: z.string().min(1, 'Wishlist ID is required'),
});

const CreateWishlistInviteSchema = z.object({
  wishlistId: z.string().min(1, 'Wishlist ID is required'),
});

export const getAllWishlistsAdmin = async () => {
  try {
    const { user } = await getSession();
    if (!isWishlistAdmin(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    const wishlists = await db.wishlist.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            members: true,
            gifts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return { wishlists };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Something went wrong fetching wishlists' };
  }
};

export const createWishlistAdmin = async (input: {
  name: string;
  pin: string;
}) => {
  const validated = CreateWishlistSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Invalid input' };
  }

  try {
    const { user } = await getSession();
    if (!isWishlistAdmin(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    await db.wishlist.create({
      data: {
        name: validated.data.name,
        password: validated.data.pin,
      },
    });

    revalidateGiftRelatedCaches();
    return { success: true, message: 'Wishlist created' };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Something went wrong creating wishlist' };
  }
};

export const updateWishlistPinAdmin = async (input: {
  wishlistId: string;
  pin: string;
}) => {
  const validated = UpdateWishlistPinSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Invalid input' };
  }

  try {
    const { user } = await getSession();
    if (!isWishlistAdmin(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    await db.wishlist.update({
      where: { id: validated.data.wishlistId },
      data: { password: validated.data.pin },
    });

    revalidateGiftRelatedCaches();
    return { success: true, message: 'Wishlist pin updated' };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Something went wrong updating wishlist pin' };
  }
};

export const deleteWishlistAdmin = async (input: { wishlistId: string }) => {
  const validated = DeleteWishlistSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Invalid input' };
  }

  try {
    const { user } = await getSession();
    if (!isWishlistAdmin(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    await db.wishlist.delete({
      where: { id: validated.data.wishlistId },
    });

    revalidateGiftRelatedCaches();
    return { success: true, message: 'Wishlist deleted' };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Something went wrong deleting wishlist' };
  }
};

function generateInviteToken() {
  // 24 bytes => 32 chars in base64url-ish alphabet, good entropy for share links.
  return randomBytes(24)
    .toString('base64')
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

export const createWishlistInviteAdmin = async (input: {
  wishlistId: string;
}) => {
  const validated = CreateWishlistInviteSchema.safeParse(input);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? 'Invalid input' };
  }

  try {
    const { user } = await getSession();
    if (!isWishlistAdmin(user)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    const wishlist = await db.wishlist.findUnique({
      where: { id: validated.data.wishlistId },
      select: { id: true },
    });
    if (!wishlist) {
      return { error: 'Wishlist not found' };
    }

    // Keep only one active invite per wishlist to reduce link sprawl.
    await db.wishlistInvite.updateMany({
      where: { wishlistId: wishlist.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    let inviteToken: string | null = null;
    for (let i = 0; i < 5; i += 1) {
      const token = generateInviteToken();
      try {
        await db.wishlistInvite.create({
          data: {
            token,
            wishlist: { connect: { id: wishlist.id } },
            createdBy: { connect: { id: user.id } },
          },
        });
        inviteToken = token;
        break;
      } catch {
        // Extremely unlikely token collision; retry a few times.
      }
    }

    if (!inviteToken) {
      return { error: 'Failed to create invite link. Please try again.' };
    }

    revalidateGiftRelatedCaches();
    return {
      success: true,
      message: 'Invite link created',
      token: inviteToken,
    };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
    return { error: 'Something went wrong creating invite link' };
  }
};
