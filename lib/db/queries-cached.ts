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
  type GiftCard,
  type GiftDetail,
  giftRowSelect,
  type PersonCard,
  type PersonRef,
  type Profile,
  personRefSelect,
  profileSelect,
  toGiftCard,
} from './projections';
import {
  claimedByViewerWhere,
  visibleGiftCountWhere,
  visibleGiftsWhere,
  visiblePeopleWhere,
  visibleProfileWhere,
  visibleWishlistsWhere,
} from './visibility';

/** People the viewer may add a Gift for. */
const getPeopleForNewGiftModal = unstable_cache(
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

/** The viewer's own Wishlists, with members. */
const getWishlistsWithMembers = unstable_cache(
  async (viewerId: string) =>
    prisma.wishlist.findMany({
      where: visibleWishlistsWhere(viewerId),
      select: {
        id: true,
        name: true,
        members: { select: { id: true, name: true, email: true } },
      },
    }),
  ['wishlistsWithMembers'],
  { tags: ['wishlists', 'users'] },
);

/**
 * A person's profile, scoped to the viewer.
 *
 * Returns `null` for someone the viewer shares no Wishlist with. This used to be
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
        wishlists: { select: { id: true, name: true } },
        gifts: {
          select: { id: true, name: true, description: true, url: true },
        },
      },
    }),
  ['fullUserForRecommendations'],
  { tags: ['users', 'gifts', 'wishlists'] },
);

/** Gifts on one person's profile. */
const getVisibleGiftsForUserById = unstable_cache(
  async (profileId: string, viewerId: string): Promise<GiftCard[]> => {
    const rows = await prisma.gift.findMany({
      where: visibleGiftsWhere(viewerId, { ownerId: profileId }),
      select: giftRowSelect,
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => toGiftCard(row, viewerId));
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
          select: { gifts: { where: visibleGiftCountWhere() } },
        },
      },
      where: visiblePeopleWhere(viewerId, { excludeSelf: true }),
      orderBy: { name: 'asc' },
    });
    return rows.map(({ _count, ...person }) => ({
      ...person,
      giftCount: _count.gifts,
    }));
  },
  ['people'],
  { tags: ['users', 'gifts', 'wishlists'] },
);

/** Gifts the viewer has claimed. */
const getClaimedGiftsForMe = unstable_cache(
  async (viewerId: string): Promise<GiftCard[]> => {
    const rows = await prisma.gift.findMany({
      where: claimedByViewerWhere(viewerId),
      select: giftRowSelect,
      orderBy: { name: 'asc' },
    });
    return rows.map((row) => toGiftCard(row, viewerId));
  },
  ['claimedGiftsForMe'],
  { tags: ['gifts', 'users', 'wishlists'] },
);

/** The browse list. */
const getSortedVisibleGiftsForUser = unstable_cache(
  async ({
    column = 'name',
    direction = 'asc',
    userId,
  }: {
    direction?: 'asc' | 'desc';
    column?: 'name' | 'owner';
    userId: string;
  }): Promise<GiftCard[]> => {
    const orderBy =
      column === 'owner' ? { owner: { name: direction } } : { name: direction };
    const rows = await prisma.gift.findMany({
      where: visibleGiftsWhere(userId, { excludeOwn: true }),
      select: giftRowSelect,
      orderBy: [orderBy],
    });
    return rows.map((row) => toGiftCard(row, userId));
  },
  ['sortedVisibleGifts'],
  { tags: ['gifts', 'users', 'wishlists'] },
);

/**
 * The home feed.
 *
 * Shares `visibleGiftsWhere` with the browse list, so the `createdById` arm is
 * present — this query used to omit it, which hid the viewer's own additions.
 */
const getLatestVisibleGiftsForUserById = unstable_cache(
  async (viewerId: string): Promise<GiftCard[]> => {
    const rows = await prisma.gift.findMany({
      where: visibleGiftsWhere(viewerId, { excludeOwn: true }),
      select: giftRowSelect,
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return rows.map((row) => toGiftCard(row, viewerId));
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

/** One Gift, or `null` if the viewer may not see it. */
const getGiftWithAccessCheck = unstable_cache(
  async (giftId: string, viewerId: string): Promise<GiftDetail | null> => {
    const gift = await prisma.gift.findFirst({
      where: {
        AND: [
          { id: giftId },
          // Own-profile Gifts are reachable by their owner even when archived;
          // everything else goes through the full rule set.
          {
            OR: [
              { id: giftId, ownerId: viewerId, createdById: viewerId },
              visibleGiftsWhere(viewerId),
            ],
          },
        ],
      },
      select: {
        ...giftRowSelect,
        wishlists: { select: { id: true, name: true } },
      },
    });

    if (!gift) return null;

    const { wishlists, ...row } = gift;
    return { ...toGiftCard(row, viewerId), wishlists };
  },
  ['giftWithAccess'],
  { tags: ['gifts', 'users', 'wishlists'] },
);

export {
  getClaimedGiftsForMe,
  getFullUserForRecommendations,
  getGiftWithAccessCheck,
  getLatestVisibleGiftsForUserById,
  getOwnProfile,
  getPeopleForNewGiftModal,
  getSecretSantaEvents,
  getSortedVisibleGiftsForUser,
  getUsersForPeoplePage,
  getVisibleGiftsForUserById,
  getVisiblePeopleRefs,
  getVisibleProfile,
  getWishlistsWithMembers,
};
