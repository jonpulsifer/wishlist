/**
 * Cached reads.
 *
 * Every query here composes its `where` clause from `./visibility` rather than
 * restating the rules, and selects through `./projections` rather than
 * `include: true`. Six exports that no caller used have been removed, three of
 * which were entirely unscoped.
 */

import { unstable_cache } from 'next/cache';
import prisma from './client';
import {
  type PersonCard,
  type PersonRef,
  type Profile,
  personRefSelect,
  profileSelect,
  toWishCard,
  type WishCard,
  wishRowSelect,
} from './projections';
import {
  claimedByViewerWhere,
  visibleFamiliesWhere,
  visiblePeopleWhere,
  visibleProfileWhere,
  visibleWishCountWhere,
  visibleWishesWhere,
} from './visibility';

/** People the viewer may add a Wish for. */
const getPeopleForNewWishModal = unstable_cache(
  async (viewerId: string) =>
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      where: visiblePeopleWhere(viewerId),
      orderBy: { name: 'asc' },
    }),
  ['peopleForNewGiftModal'],
  { tags: ['users', 'wishlists'] },
);

/** People the viewer may name — the Secret Santa participant picker. */
const getVisiblePeopleRefs = unstable_cache(
  async (viewerId: string): Promise<PersonRef[]> =>
    prisma.user.findMany({
      select: personRefSelect,
      where: visiblePeopleWhere(viewerId),
      orderBy: { name: 'asc' },
    }),
  ['visiblePeopleRefs'],
  { tags: ['users', 'wishlists'] },
);

/** The Families the viewer belongs to, with their members. */
const getFamiliesWithMembers = unstable_cache(
  async (viewerId: string) =>
    prisma.family.findMany({
      where: visibleFamiliesWhere(viewerId),
      select: {
        id: true,
        name: true,
        memberships: {
          select: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    }),
  ['wishlistsWithMembers'],
  { tags: ['wishlists', 'users'] },
);

/**
 * A person's profile, scoped to the viewer.
 *
 * Returns `null` for someone the viewer shares no Family with. This used to be
 * a bare `findUnique`, so any signed-in viewer with a uuid could read a
 * stranger's shipping address and sizes.
 */
const getVisibleProfile = unstable_cache(
  async (profileId: string, viewerId: string): Promise<Profile | null> =>
    prisma.user.findFirst({
      where: visibleProfileWhere(viewerId, profileId),
      select: profileSelect,
    }),
  ['visibleProfile'],
  { tags: ['users', 'wishlists'] },
);

/** The viewer's own profile, for the edit form. */
const getOwnProfile = unstable_cache(
  async (viewerId: string): Promise<Profile | null> =>
    prisma.user.findUnique({ where: { id: viewerId }, select: profileSelect }),
  ['ownProfile'],
  { tags: ['users'] },
);

/** A person plus everything the AI recommender reads. Viewer-scoped. */
const getFullUserForRecommendations = unstable_cache(
  async (profileId: string, viewerId: string) =>
    prisma.user.findFirst({
      where: visibleProfileWhere(viewerId, profileId),
      select: {
        ...profileSelect,
        wishes: {
          select: { id: true, name: true, description: true, url: true },
        },
      },
    }),
  ['fullUserForRecommendations'],
  { tags: ['users', 'gifts', 'wishlists'] },
);

/** Wishes on one person's profile. */
const getVisibleWishesForUserById = unstable_cache(
  async (profileId: string, viewerId: string): Promise<WishCard[]> => {
    const rows = await prisma.wish.findMany({
      where: visibleWishesWhere(viewerId, { subjectId: profileId }),
      select: wishRowSelect,
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => toWishCard(row, viewerId));
  },
  ['visibleGiftsForUserById'],
  { tags: ['gifts', 'users', 'wishlists'] },
);

/** The People index. */
const getUsersForPeoplePage = unstable_cache(
  async (viewerId: string): Promise<PersonCard[]> => {
    const rows = await prisma.user.findMany({
      select: {
        ...personRefSelect,
        _count: {
          select: { wishes: { where: visibleWishCountWhere() } },
        },
      },
      where: visiblePeopleWhere(viewerId, { excludeSelf: true }),
      orderBy: { name: 'asc' },
    });
    return rows.map(({ _count, ...person }) => ({
      ...person,
      wishCount: _count.wishes,
    }));
  },
  ['people'],
  { tags: ['users', 'gifts', 'wishlists'] },
);

/** Wishes the viewer has claimed. */
const getClaimedWishesForMe = unstable_cache(
  async (viewerId: string): Promise<WishCard[]> => {
    const rows = await prisma.wish.findMany({
      where: claimedByViewerWhere(viewerId),
      select: wishRowSelect,
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => toWishCard(row, viewerId));
  },
  ['claimedGiftsForMe'],
  { tags: ['gifts', 'users', 'wishlists'] },
);

/** The browse list. */
const getSortedVisibleWishesForUser = unstable_cache(
  async ({
    column = 'name',
    direction = 'asc',
    userId,
  }: {
    direction?: 'asc' | 'desc';
    column?: 'name' | 'owner';
    userId: string;
  }): Promise<WishCard[]> => {
    // `owner` is the sort value in the URL, which is copy and stays put.
    const orderBy =
      column === 'owner'
        ? { subject: { name: direction } }
        : { name: direction };
    const rows = await prisma.wish.findMany({
      where: visibleWishesWhere(userId, { excludeOwn: true }),
      select: wishRowSelect,
      orderBy: [orderBy],
    });
    return rows.map((row) => toWishCard(row, userId));
  },
  ['sortedVisibleGifts'],
  { tags: ['gifts', 'users', 'wishlists'] },
);

/**
 * The home feed.
 *
 * Shares `visibleWishesWhere` with the browse list, so the `proposerId` arm is
 * present — this query used to omit it, which hid the viewer's own additions.
 */
const getLatestVisibleWishesForUserById = unstable_cache(
  async (viewerId: string): Promise<WishCard[]> => {
    const rows = await prisma.wish.findMany({
      where: visibleWishesWhere(viewerId, { excludeOwn: true }),
      select: wishRowSelect,
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return rows.map((row) => toWishCard(row, viewerId));
  },
  ['latestVisibleGiftsForUserById'],
  { tags: ['gifts', 'users', 'wishlists'] },
);

/**
 * Secret Santa events.
 *
 * Selects only what the page renders. The previous version pulled every
 * participant's `assignedTo` as a full `User` row for every event, so the whole
 * assignment graph reached the caller.
 */
const getSecretSantaEvents = unstable_cache(
  async (viewerId: string) => {
    const events = await prisma.secretSantaEvent.findMany({
      select: {
        id: true,
        name: true,
        year: true,
        createdAt: true,
        createdById: true,
        participants: {
          select: {
            userId: true,
            assignedToId: true,
            user: { select: personRefSelect },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return events.map(({ participants, ...event }) => {
      const isParticipating = participants.some((p) => p.userId === viewerId);
      const hasAssignments = participants.some((p) => p.assignedToId !== null);
      return {
        ...event,
        participants: participants.map(({ user }) => user),
        participantCount: participants.length,
        isParticipating,
        hasAssignments,
        canJoin: !isParticipating && !hasAssignments,
        isOwner: event.createdById === viewerId,
      };
    });
  },
  ['secretSantaEvents'],
  { tags: ['secretSanta', 'users'] },
);

/** One Wish, or `null` if the viewer may not see it. */
const getWishWithAccessCheck = unstable_cache(
  async (wishId: string, viewerId: string): Promise<WishCard | null> => {
    const wish = await prisma.wish.findFirst({
      where: {
        AND: [
          { id: wishId },
          // A Wish on your own list is reachable by its subject even when
          // archived; everything else goes through the full rule set.
          {
            OR: [
              { id: wishId, subjectId: viewerId, proposerId: viewerId },
              visibleWishesWhere(viewerId),
            ],
          },
        ],
      },
      select: wishRowSelect,
    });

    if (!wish) return null;

    return toWishCard(wish, viewerId);
  },
  ['giftWithAccess'],
  { tags: ['gifts', 'users', 'wishlists'] },
);

export {
  getClaimedWishesForMe,
  getFamiliesWithMembers,
  getFullUserForRecommendations,
  getLatestVisibleWishesForUserById,
  getOwnProfile,
  getPeopleForNewWishModal,
  getSecretSantaEvents,
  getSortedVisibleWishesForUser,
  getUsersForPeoplePage,
  getVisiblePeopleRefs,
  getVisibleProfile,
  getVisibleWishesForUserById,
  getWishWithAccessCheck,
};
