export const WISHLIST_INVITE_COOKIE_NAME = 'wishlist_invite_token';

export const WISHLIST_INVITE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days

export function buildInvitePath(token: string) {
  return `/invite/${token}`;
}
