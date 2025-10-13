import { unstable_cache } from 'next/cache';
import prisma from './client';

const CURRENT_YEAR = new Date().getFullYear();
const currentYearFilter = {
  createdAt: {
    gte: new Date(`${CURRENT_YEAR - 2}-01-01`),
    lt: new Date(`${CURRENT_YEAR + 1}-01-01`),
  },
};

const getPeopleForNewGiftModal = unstable_cache(
  async (userId: string) =>
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        wishlists: {
          some: {
            members: { some: { id: userId } },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ['peopleForNewGiftModal'],
  {
    tags: ['users'],
  },
);

const getUsersWithGiftCount = unstable_cache(
  async (id: string) =>
    await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        _count: {
          select: {
            gifts: {
              where: {
                archived: false,
                ...currentYearFilter,
                AND: {
                  OR: [
                    { claimed: false },
                    {
                      claimed: true,
                      claimedBy: {
                        id,
                      },
                    },
                    { createdBy: { id } },
                  ],
                },
              },
            },
          },
        },
      },
      where: {
        wishlists: {
          some: {
            members: {
              some: {
                id,
              },
            },
          },
        },
        NOT: {
          id,
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ['usersWithGiftCount'],
  { tags: ['users', 'gifts'] },
);

const getWishlistsWithMembers = unstable_cache(
  async () =>
    prisma.wishlist.findMany({
      select: {
        id: true,
        name: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ['wishlistsWithMembers'],
  { tags: ['wishlists', 'users'] },
);

const getWishlistsWithMemberIds = unstable_cache(
  async () =>
    prisma.wishlist.findMany({
      select: {
        id: true,
        name: true,
        members: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            members: true,
            gifts: {
              where: {
                archived: false,
                ...currentYearFilter,
              },
            },
          },
        },
      },
    }),
  ['wishlists'],
  {
    tags: ['wishlists', 'users', 'gifts'],
  },
);

const getUsers = unstable_cache(async () => prisma.user.findMany(), ['users'], {
  tags: ['users'],
});

const getUserById = unstable_cache(
  async (id: string) => prisma.user.findUnique({ where: { id } }),
  ['userById'],
  { tags: ['users'] },
);

// Gets user with ALL gifts (including archived) for AI recommendations
const getFullUserById = unstable_cache(
  async (id: string) =>
    prisma.user.findUnique({
      where: { id },
      include: {
        wishlists: true,
        secretSantaParticipations: true,
        gifts: true, // Includes ALL gifts (archived and non-archived)
      },
    }),
  ['fullUserById'],
  { tags: ['users', 'gifts', 'wishlists'] },
);

const getVisibleGiftsForUserById = unstable_cache(
  async (id: string, currentUserId: string) =>
    prisma.gift.findMany({
      where: {
        // Only filter out archived gifts when viewing someone else's profile
        ...(currentUserId !== id && { archived: false }),
        ownerId: id,
        createdById: currentUserId === id ? id : undefined,
        ...currentYearFilter,
        AND: {
          OR: [
            { claimed: false },
            {
              claimed: true,
              claimedBy: {
                id: currentUserId,
              },
            },
            { createdBy: { id: currentUserId } },
          ],
        },
      },
      include: {
        owner: true,
        claimedBy: true,
        createdBy: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ['visibleGiftsForUserById'],
  { tags: ['gifts', 'users'] },
);

const getUsersForPeoplePage = unstable_cache(
  async (currentUserId: string) =>
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        _count: {
          select: {
            gifts: {
              where: {
                archived: false,
                ...currentYearFilter,
                AND: {
                  OR: [
                    { claimed: false },
                    {
                      claimed: true,
                      claimedBy: {
                        id: currentUserId,
                      },
                    },
                    { createdBy: { id: currentUserId } },
                  ],
                },
              },
            },
          },
        },
      },
      where: {
        wishlists: {
          some: {
            members: { some: { id: currentUserId } },
          },
        },
        AND: {
          NOT: {
            id: currentUserId,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ['people'],
  { tags: ['users', 'gifts', 'wishlists'] },
);

const getGiftsWithOwnerClaimedByAndCreatedBy = unstable_cache(
  async () =>
    prisma.gift.findMany({
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdById: true,
        claimedById: true,
        url: true,
        description: true,
        owner: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        claimedBy: { select: { id: true, name: true, email: true } },
      },
      where: {
        archived: false,
        ...currentYearFilter,
      },
    }),
  ['gifts'],
  {
    tags: ['gifts', 'users'],
  },
);

const getClaimedGiftsForMe = unstable_cache(
  async (currentUserId: string) =>
    prisma.gift.findMany({
      where: {
        archived: false,
        claimedById: {
          equals: currentUserId,
        },
        ...currentYearFilter,
      },
      include: {
        owner: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ['claimedGiftsForMe'],
  {
    tags: ['gifts', 'users'],
  },
);

const getGiftWithOwnerClaimedByAndCreatedBy = unstable_cache(
  async (id: string) =>
    prisma.gift.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        ownerId: true,
        createdById: true,
        claimedById: true,
        url: true,
        description: true,
        owner: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        claimedBy: { select: { id: true, name: true, email: true } },
      },
    }),
  ['fullGiftById'],
  {
    tags: ['gifts'],
  },
);

const getGiftById = unstable_cache(
  async (id: string) => prisma.gift.findUniqueOrThrow({ where: { id } }),
  ['giftById'],
  { tags: ['gifts'] },
);

const getSortedVisibleGiftsForUser = unstable_cache(
  async ({
    column = 'name',
    direction = 'asc',
    userId,
  }: {
    direction?: 'asc' | 'desc';
    column?: 'name' | 'owner';
    userId: string;
  }) => {
    const orderBy =
      column === 'owner' ? { owner: { name: direction } } : { name: direction };
    return prisma.gift.findMany({
      where: {
        archived: false,
        NOT: { ownerId: userId },
        wishlists: {
          some: {
            members: { some: { id: userId } },
          },
        },
        ...currentYearFilter,
        OR: [
          { claimed: false },
          { claimedById: userId },
          { createdById: userId },
        ],
      },
      include: {
        owner: true,
        claimedBy: true,
        createdBy: true,
      },
      orderBy: [orderBy],
    });
  },
  ['sortedVisibleGifts'],
  { tags: ['gifts', 'users'] },
);

const getLatestVisibleGiftsForUserById = unstable_cache(
  async (id: string) =>
    prisma.gift.findMany({
      where: {
        archived: false,
        ...currentYearFilter,
        ownerId: { not: id },
        AND: {
          OR: [
            { claimed: false },
            {
              claimed: true,
              claimedBy: {
                id,
              },
            },
          ],
        },
      },
      include: {
        owner: true,
        claimedBy: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    }),
  ['latestVisibleGiftsForUserById'],
  { tags: ['gifts', 'users'] },
);

const getSecretSantaEvents = unstable_cache(
  async (userId: string) => {
    const events = await prisma.secretSantaEvent.findMany({
      include: {
        participants: {
          include: {
            user: true,
            assignedTo: true,
          },
        },
      },
    });

    return events.map((event) => ({
      ...event,
      isParticipating: event.participants.some((p) => p.userId === userId),
      canJoin:
        !event.participants.some((p) => p.userId === userId) &&
        !event.participants.some((p) => p.assignedToId),
    }));
  },
  ['secretSantaEvents'],
  { tags: ['secretSanta'] },
);

const getGiftWithAccessCheck = unstable_cache(
  async (giftId: string, userId: string) => {
    const gift = await prisma.gift.findUnique({
      where: {
        id: giftId,
      },
      include: {
        owner: true,
        claimedBy: true,
        createdBy: true,
        wishlists: {
          select: {
            id: true,
            name: true,
            members: {
              where: { id: userId },
              select: { id: true },
            },
          },
        },
      },
    });

    if (!gift) return null;

    // Don't return archived gifts
    if (gift.archived) return null;

    // Check if user has access through any wishlist
    const hasAccess = gift.wishlists.some(
      (wishlist) => wishlist.members.length > 0,
    );
    if (!hasAccess) return null;

    const isOwner = gift.ownerId === userId;
    const isCreator = gift.createdById === userId;

    return {
      ...gift,
      canEdit: isOwner || isCreator,
    };
  },
  ['giftWithAccess'],
  { tags: ['gifts', 'users', 'wishlists'] },
);

export {
  getClaimedGiftsForMe,
  getFullUserById,
  getGiftById,
  getGiftWithAccessCheck,
  getGiftsWithOwnerClaimedByAndCreatedBy,
  getGiftWithOwnerClaimedByAndCreatedBy,
  getLatestVisibleGiftsForUserById,
  getPeopleForNewGiftModal,
  getSecretSantaEvents,
  getSortedVisibleGiftsForUser,
  getUserById,
  getUsers,
  getUsersForPeoplePage,
  getUsersWithGiftCount,
  getVisibleGiftsForUserById,
  getWishlistsWithMemberIds,
  getWishlistsWithMembers,
};
