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
 *      and only Gifts whose owner you share a Wishlist with. Visibility follows
 *      the subject, not a snapshot taken when the Gift was added.
 *   2. Archived Gifts are hidden, except on your own profile.
 *   3. Only Gifts from the current Season's gift window are in scope.
 *   4. Your own profile shows only the Gifts you added yourself, so Gifts other
 *      people added for you stay a surprise.
 *
 * Claim secrecy is deliberately not here. A subject sees their own list, so
 * filtering a claimed Gift out of it makes the row *vanish*, and absence is a
 * louder signal than a badge. It is a property of the payload instead —
 * `lib/db/projections.ts` (ADR-0004).
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

/**
 * Gifts whose owner shares at least one Wishlist with the viewer.
 *
 * Derived from the subject, not from `Gift.wishlists`. That column pinned each
 * row to the Wishlists its owner belonged to at the moment it was added — a
 * cache of an answer that was true once, and stale in both directions.
 */
function ownerSharesAWishlistWithViewer(
  viewerId: string,
): Prisma.GiftWhereInput {
  return {
    owner: { wishlists: { some: { members: { some: { id: viewerId } } } } },
  };
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
    ...ownerSharesAWishlistWithViewer(viewerId),
  };
}

/** The `where` clause for "Gifts this viewer has claimed". */
export function claimedByViewerWhere(
  viewerId: string,
  now?: Date,
): Prisma.GiftWhereInput {
  return {
    archived: false,
    claimers: { some: { userId: viewerId } },
    createdAt: giftWindow(now),
    ...ownerSharesAWishlistWithViewer(viewerId),
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
 * Counting Gifts on a person's card. Shares the archive rule and the year
 * window with `visibleGiftsWhere`, but is scoped by the relation it hangs off
 * rather than by `ownerId` — the caller has already restricted the People it
 * counts for to `visiblePeopleWhere`, which is the same membership rule.
 */
export function visibleGiftCountWhere(now?: Date): Prisma.GiftWhereInput {
  return { archived: false, createdAt: giftWindow(now) };
}
