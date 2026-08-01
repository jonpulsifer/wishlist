'use server';

import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { ActionError, defineAction } from '@/lib/actions/define';
import db from '@/lib/db/client';

const WISHLIST_CACHES = ['gifts', 'users', 'wishlists'] as const;

const WishlistPinSchema = z.string().regex(/^\d{4}$/, 'Pin must be 4 digits');

const wishlistIdSchema = z.object({
  wishlistId: z.string().min(1, 'Wishlist ID is required'),
});

export const getAllWishlistsAdmin = defineAction(
  { capability: 'manage:wishlists' },
  async () => {
    const wishlists = await db.wishlist.findMany({
      select: {
        id: true,
        name: true,
        _count: { select: { members: true, gifts: true } },
      },
      orderBy: { name: 'asc' },
    });
    return { wishlists };
  },
);

export const createWishlistAdmin = defineAction(
  {
    capability: 'manage:wishlists',
    input: z.object({
      name: z.string().trim().min(1, 'Wishlist name is required').max(255),
      pin: WishlistPinSchema,
    }),
    invalidates: WISHLIST_CACHES,
  },
  async ({ input }) => {
    await db.wishlist.create({
      data: { name: input.name, password: input.pin },
    });
    return { message: 'Wishlist created' };
  },
);

export const updateWishlistPinAdmin = defineAction(
  {
    capability: 'manage:wishlists',
    input: wishlistIdSchema.extend({ pin: WishlistPinSchema }),
    invalidates: WISHLIST_CACHES,
  },
  async ({ input }) => {
    await db.wishlist.update({
      where: { id: input.wishlistId },
      data: { password: input.pin },
    });
    return { message: 'Wishlist pin updated' };
  },
);

export const deleteWishlistAdmin = defineAction(
  {
    capability: 'manage:wishlists',
    input: wishlistIdSchema,
    invalidates: WISHLIST_CACHES,
  },
  async ({ input }) => {
    await db.wishlist.delete({ where: { id: input.wishlistId } });
    return { message: 'Wishlist deleted' };
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

export const createWishlistInviteAdmin = defineAction(
  {
    capability: 'manage:wishlists',
    input: wishlistIdSchema,
    invalidates: WISHLIST_CACHES,
  },
  async ({ viewer, input }) => {
    const wishlist = await db.wishlist.findUnique({
      where: { id: input.wishlistId },
      select: { id: true },
    });
    if (!wishlist) throw new ActionError('Wishlist not found');

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
            createdBy: { connect: { id: viewer.id } },
          },
        });
        inviteToken = token;
        break;
      } catch {
        // Extremely unlikely token collision; retry a few times.
      }
    }

    if (!inviteToken) {
      throw new ActionError('Failed to create invite link. Please try again.');
    }

    return { token: inviteToken, message: 'Invite link created' };
  },
);
