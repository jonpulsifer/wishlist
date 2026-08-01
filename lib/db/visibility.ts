/**
 * Who may see which Gifts and which People.
 *
 * This is the single place the visibility rules are written down. Every query
 * that returns Gifts or People composes its `where` clause from here rather
 * than restating the rules, so the rules cannot drift apart.
 *
 * The functions are pure: they take a viewer id and return a Prisma `where`
 * object. Nothing here touches the database, so the rules can be asserted
 * directly in tests.
 *
 * The rules:
 *   1. Wishlist membership — you only see People you share a Wishlist with,
 *      and only Gifts that sit on a Wishlist you belong to.
 *   2. Claim secrecy — you see a Gift if it is unclaimed, or you claimed it, or
 *      you created it. You never learn that someone else claimed something.
 *   3. Archived Gifts are hidden, except on your own profile.
 *   4. Only Gifts from the current Season's gift window are in scope.
 *   5. Your own profile shows only the Gifts you added yourself, so Gifts other
 *      people added for you stay a surprise.
 *
 * Which year is in play is not decided here — `lib/season` owns that, and every
 * window in the app is measured against the same Season.
 */

import { currentSeason } from '@/lib/season';
import type { Prisma } from '@/prisma/generated/client';

/** The Season's gift window, as a Prisma filter. Computed per call. */
function giftWindow(now?: Date): Prisma.DateTimeFilter {
  return currentSeason(now).giftWindow;
}

/** Gifts sitting on at least one Wishlist the viewer belongs to. */
function onAWishlistWithViewer(viewerId: string): Prisma.GiftWhereInput {
  return { wishlists: { some: { members: { some: { id: viewerId } } } } };
}

/**
 * Rule 2. Note all three arms matter: dropping the `createdById` arm hides the
 * viewer's own additions from their feed.
 */
function claimVisibleToViewer(viewerId: string): Prisma.GiftWhereInput[] {
  return [
    { claimed: false },
    { claimedById: viewerId },
    { createdById: viewerId },
  ];
}

export type GiftScope = {
  /** Restrict to Gifts owned by this person. */
  ownerId?: string;
  /** Drop the viewer's own Gifts — used by the browse and home feeds. */
  excludeOwn?: boolean;
  /** Evaluate the year window against this instant. Tests pass a fixed date. */
  now?: Date;
};

/**
 * The `where` clause for "Gifts this viewer may see".
 *
 * Viewing your own profile (`ownerId === viewerId`) takes the surprise-preserving
 * branch: archived Gifts become visible, but only Gifts you created yourself are
 * returned. Everything else takes the full rule set.
 */
export function visibleGiftsWhere(
  viewerId: string,
  scope: GiftScope = {},
): Prisma.GiftWhereInput {
  const { ownerId, excludeOwn, now } = scope;
  const createdAt = giftWindow(now);

  if (ownerId && ownerId === viewerId) {
    return {
      ownerId: viewerId,
      createdById: viewerId,
      createdAt,
    };
  }

  return {
    archived: false,
    createdAt,
    ...(ownerId ? { ownerId } : {}),
    ...(excludeOwn ? { ownerId: { not: viewerId } } : {}),
    ...onAWishlistWithViewer(viewerId),
    OR: claimVisibleToViewer(viewerId),
  };
}

/** The `where` clause for "Gifts this viewer has claimed". */
export function claimedByViewerWhere(
  viewerId: string,
  now?: Date,
): Prisma.GiftWhereInput {
  return {
    archived: false,
    claimedById: viewerId,
    createdAt: giftWindow(now),
    ...onAWishlistWithViewer(viewerId),
  };
}

export type PeopleScope = {
  /** Drop the viewer from the results. */
  excludeSelf?: boolean;
};

/**
 * The `where` clause for "People this viewer may see" — anyone sharing at least
 * one Wishlist with them.
 */
export function visiblePeopleWhere(
  viewerId: string,
  scope: PeopleScope = {},
): Prisma.UserWhereInput {
  return {
    wishlists: { some: { members: { some: { id: viewerId } } } },
    ...(scope.excludeSelf ? { NOT: { id: viewerId } } : {}),
  };
}

/**
 * The `where` clause for reading one person's profile.
 *
 * Always compose profile reads from this rather than a bare `findUnique` — a
 * bare lookup by id exposes shipping addresses and sizes to anyone with a uuid.
 */
export function visibleProfileWhere(
  viewerId: string,
  profileId: string,
): Prisma.UserWhereInput {
  if (profileId === viewerId) return { id: viewerId };
  return { id: profileId, ...visiblePeopleWhere(viewerId) };
}

/** The `where` clause for Wishlists the viewer may see by name. */
export function visibleWishlistsWhere(
  viewerId: string,
): Prisma.WishlistWhereInput {
  return { members: { some: { id: viewerId } } };
}

/**
 * Counting Gifts on a person's card. Shares rule 2 and the year window with
 * `visibleGiftsWhere`, but is scoped by the relation it hangs off rather than
 * by `ownerId`.
 */
export function visibleGiftCountWhere(
  viewerId: string,
  now?: Date,
): Prisma.GiftWhereInput {
  return {
    archived: false,
    createdAt: giftWindow(now),
    OR: claimVisibleToViewer(viewerId),
  };
}
