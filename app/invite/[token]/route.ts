import { type NextRequest, NextResponse } from 'next/server';
import { revalidateGiftRelatedCaches } from '@/app/_actions/gifts';
import { currentViewer } from '@/lib/auth/viewer';
import db from '@/lib/db/client';
import {
  WISHLIST_INVITE_COOKIE_MAX_AGE_SECONDS,
  WISHLIST_INVITE_COOKIE_NAME,
} from '@/lib/wishlist-invites';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const viewer = await currentViewer();

  // Not signed in yet: remember the invite and send them to login.
  if (!viewer) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set({
      name: WISHLIST_INVITE_COOKIE_NAME,
      value: token,
      path: '/',
      maxAge: WISHLIST_INVITE_COOKIE_MAX_AGE_SECONDS,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
    });
    return response;
  }

  const response = NextResponse.redirect(new URL('/wishlists', request.url));

  // Signed in: validate the token and join. This is the only door in.
  const invite = await db.wishlistInvite.findFirst({
    where: {
      token,
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: { wishlistId: true },
  });

  if (!invite) {
    response.cookies.set({
      name: WISHLIST_INVITE_COOKIE_NAME,
      value: '',
      path: '/',
      maxAge: 0,
    });
    return response;
  }

  // The pair is the primary key, so following the same link twice is a no-op
  // rather than a duplicate — no read-then-write, and no race between the two.
  const { count } = await db.membership.createMany({
    data: { familyId: invite.wishlistId, userId: viewer.id },
    skipDuplicates: true,
  });

  if (count > 0) revalidateGiftRelatedCaches();

  response.cookies.set({
    name: WISHLIST_INVITE_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });

  return response;
}
