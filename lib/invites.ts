/**
 * The Invite link, on both sides of sign-in.
 *
 * Client-safe: no Prisma, no `next/*`.
 */

/** Remembers the token across a sign-in the viewer had not done yet. */
export const INVITE_COOKIE_NAME = 'wishlist_invite_token';

export const INVITE_LIFETIME_DAYS = 14;

const DAY_IN_SECONDS = 60 * 60 * 24;

/**
 * The cookie outlives nothing: it is the same fortnight the link itself lasts,
 * so a token that survives sign-in cannot outlive the Invite it names.
 */
export const INVITE_COOKIE_MAX_AGE_SECONDS =
  INVITE_LIFETIME_DAYS * DAY_IN_SECONDS;

export function inviteExpiryFrom(now: Date = new Date()): Date {
  return new Date(now.getTime() + INVITE_LIFETIME_DAYS * DAY_IN_SECONDS * 1000);
}

export function buildInvitePath(token: string) {
  return `/invite/${token}`;
}
