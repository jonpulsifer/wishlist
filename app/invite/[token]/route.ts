import { type NextRequest, NextResponse } from 'next/server';
import { revalidateGiftRelatedCaches } from '@/app/_actions/gifts';
import { currentViewer } from '@/lib/auth/viewer';
import db from '@/lib/db/client';
import {
  INVITE_COOKIE_MAX_AGE_SECONDS,
  INVITE_COOKIE_NAME,
} from '@/lib/invites';

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
      name: INVITE_COOKIE_NAME,
      value: token,
      path: '/',
      maxAge: INVITE_COOKIE_MAX_AGE_SECONDS,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
    });
    return response;
  }

  const response = NextResponse.redirect(new URL('/wishlists', request.url));

  // Signed in: validate the token and join. This is the only door in, and the
  // only irreversible act in the model — so a token that is spent, revoked or
  // out of date opens nothing, and a forwarded link does nothing at all.
  const invite = await db.invite.findFirst({
    where: {
      token,
      revokedAt: null,
      redeemedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: { id: true, familyId: true },
  });

  if (!invite) {
    response.cookies.set({
      name: INVITE_COOKIE_NAME,
      value: '',
      path: '/',
      maxAge: 0,
    });
    return response;
  }

  // Redemption is claimed with the same statement that reads it: two people
  // following one link race here, and `updateMany` on the unredeemed row means
  // exactly one of them wins. The membership only follows if it did.
  const { count: claimed } = await db.invite.updateMany({
    where: { id: invite.id, redeemedAt: null },
    data: { redeemedAt: new Date(), redeemedById: viewer.id },
  });

  if (claimed > 0) {
    // The pair is the primary key, so someone already in the Family simply
    // stays in it — spending their own link on nothing, which is the correct
    // cost of following one twice.
    await db.membership.createMany({
      data: { familyId: invite.familyId, userId: viewer.id },
      skipDuplicates: true,
    });
    revalidateGiftRelatedCaches();
  }

  response.cookies.set({
    name: INVITE_COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });

  return response;
}
