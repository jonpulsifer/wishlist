/**
 * Who may see which Wishes and which People.
 *
 * This is the single place the visibility rules are written down. Every query
 * that returns Wishes or People composes its `where` clause from here rather
 * than restating the rules, so the rules cannot drift apart.
 *
 * The functions are pure: they take a viewer id and return a Prisma `where`
 * object. Nothing here touches the database, so the rules can be asserted
 * directly in tests.
 *
 * The rules:
 *   1. Family membership — you only see People you share a Family with, and
 *      only Wishes whose subject you share a Family with. Visibility follows
 *      the subject, not a snapshot taken when the Wish was added.
 *   2. Archived Wishes are hidden, except on your own profile.
 *   3. Only Wishes from the current Season's gift window are in scope.
 *   4. Your own profile shows only the Wishes you are the proposer of, so
 *      Suggestions other people made for you stay a surprise.
 *
 * Claim secrecy is deliberately not here. A subject sees their own list, so
 * filtering a claimed Wish out of it makes the row *vanish*, and absence is a
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
 * Sharing a Family with the viewer, as a clause on a `User`.
 *
 * Both hops are `some`, so membership stays mutual: the person is in a Family
 * the viewer is also in. Written once here because it is the whole disclosure
 * boundary (ADR-0001) and the two callers below must not be able to disagree.
 */
function sharesAFamilyWithViewer(viewerId: string): Prisma.UserWhereInput {
  return {
    memberships: {
      some: { family: { memberships: { some: { userId: viewerId } } } },
    },
  };
}

/**
 * Wishes whose subject shares a Family with the viewer.
 *
 * Derived from the subject, not from a column on the Wish. Such a column pinned
 * each row to the Families its subject belonged to at the moment it was added —
 * a cache of an answer that was true once, and stale in both directions.
 */
function subjectSharesAFamilyWithViewer(
  viewerId: string,
): Prisma.WishWhereInput {
  return { subject: sharesAFamilyWithViewer(viewerId) };
}

export type WishScope = {
  /** Restrict to Wishes this person is the subject of. */
  subjectId?: string;
  /** Drop the viewer's own Wishes — used by the browse and home feeds. */
  excludeOwn?: boolean;
  /** Evaluate the year window against this instant. Tests pass a fixed date. */
  now?: Date;
};

/**
 * The `where` clause for "Wishes this viewer may see".
 *
 * Viewing your own profile (`subjectId === viewerId`) takes the surprise-
 * preserving branch: archived Wishes become visible, but only the ones you
 * proposed yourself are returned. Everything else takes the full rule set.
 */
export function visibleWishesWhere(
  viewerId: string,
  scope: WishScope = {},
): Prisma.WishWhereInput {
  const { subjectId, excludeOwn, now } = scope;
  const createdAt = giftWindow(now);

  if (subjectId && subjectId === viewerId) {
    return {
      subjectId: viewerId,
      proposerId: viewerId,
      createdAt,
    };
  }

  return {
    archived: false,
    createdAt,
    ...(subjectId ? { subjectId } : {}),
    ...(excludeOwn ? { subjectId: { not: viewerId } } : {}),
    ...subjectSharesAFamilyWithViewer(viewerId),
  };
}

/** The `where` clause for "Wishes this viewer has claimed". */
export function claimedByViewerWhere(
  viewerId: string,
  now?: Date,
): Prisma.WishWhereInput {
  return {
    archived: false,
    claimers: { some: { userId: viewerId } },
    createdAt: giftWindow(now),
    ...subjectSharesAFamilyWithViewer(viewerId),
  };
}

export type PeopleScope = {
  /** Drop the viewer from the results. */
  excludeSelf?: boolean;
};

/**
 * The `where` clause for "People this viewer may see" — anyone sharing at least
 * one Family with them.
 */
export function visiblePeopleWhere(
  viewerId: string,
  scope: PeopleScope = {},
): Prisma.UserWhereInput {
  return {
    ...sharesAFamilyWithViewer(viewerId),
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

/** The `where` clause for the Families the viewer belongs to. */
export function visibleFamiliesWhere(
  viewerId: string,
): Prisma.FamilyWhereInput {
  return { memberships: { some: { userId: viewerId } } };
}

/**
 * Counting Wishes on a person's card. Shares the archive rule and the year
 * window with `visibleWishesWhere`, but is scoped by the relation it hangs off
 * rather than by `subjectId` — the caller has already restricted the People it
 * counts for to `visiblePeopleWhere`, which is the same membership rule.
 */
export function visibleWishCountWhere(now?: Date): Prisma.WishWhereInput {
  return { archived: false, createdAt: giftWindow(now) };
}
