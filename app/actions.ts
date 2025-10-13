'use server';

import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { getSession } from '@/app/auth';
import db from '@/lib/db/client';

const revalidateGiftRelatedCaches = () => {
  revalidateTag('gifts');
  revalidateTag('users');
  revalidateTag('wishlists');
};

const GiftSchema = z.object({
  recipientId: z.string().min(1, 'Recipient is required'),
  name: z.string().min(1, 'Gift name is required'),
  url: z.string().url().optional().or(z.literal('')),
  description: z.string().optional(),
});

export type GiftFormData = z.infer<typeof GiftSchema>;

export const addGift = async (_state: unknown, formData: GiftFormData) => {
  const validatedFields = GiftSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to add gift. Please check the form for errors.',
    };
  }

  try {
    const { user } = await getSession();
    const wishlists = await db.wishlist.findMany({
      select: {
        id: true,
      },
      where: {
        members: {
          some: {
            id: user.id,
          },
        },
      },
    });

    const wishlistIds = wishlists.map((wishlist) => ({ id: wishlist.id }));
    await db.gift.create({
      data: {
        name: validatedFields.data.name,
        url: validatedFields.data.url,
        description: validatedFields.data.description,
        owner: {
          connect: {
            id: validatedFields.data.recipientId,
          },
        },
        createdBy: {
          connect: {
            id: user.id,
          },
        },
        wishlists: {
          connect: wishlistIds,
        },
      },
    });
    revalidateGiftRelatedCaches();
    return {
      success: true,
      message: `${validatedFields.data.name} has been added to the wishlist.`,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
};

export const deleteGift = async (id: string) => {
  try {
    const { user } = await getSession();
    const gift = await db.gift.findUnique({
      where: { id },
      select: {
        ownerId: true,
        createdById: true,
        name: true,
      },
    });

    if (!gift) {
      return { error: 'Gift not found' };
    }

    const isOwner = gift.ownerId === user.id;
    const isCreator = gift.createdById === user.id;
    if (!isOwner && !isCreator) {
      return { error: 'You are not the owner or creator of this gift' };
    }

    await db.gift.delete({
      where: { id },
    });
    revalidateGiftRelatedCaches();
    return { success: true, message: `${gift.name} has been deleted` };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
};

export const updateGift = async ({
  id,
  name,
  description,
  url,
}: {
  id: string;
  name: string;
  description: string;
  url: string;
}) => {
  try {
    const { user } = await getSession();
    const gift = await db.gift.findUnique({
      where: {
        id,
      },
      select: {
        ownerId: true,
        createdById: true,
      },
    });
    const isOwner = gift?.ownerId === user.id;
    const isCreator = gift?.createdById === user.id;
    if (isOwner || isCreator) {
      await db.gift.update({
        where: {
          id,
        },
        data: {
          name,
          url,
          description,
        },
      });
    } else {
      return { error: 'You are not the owner or creator of this gift' };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
  revalidateGiftRelatedCaches();
};

export const claimGift = async (id: string) => {
  try {
    const { user } = await getSession();
    const gift = await db.gift.findUnique({
      where: {
        id,
      },
      select: {
        claimedBy: true,
        ownerId: true,
        name: true,
      },
    });

    if (!gift) {
      return { error: 'Gift not found' };
    }

    // determine if the gift has been claimed by someone else
    const isClaimed = Boolean(gift?.claimedBy);
    if (isClaimed) {
      return { error: 'This gift has already been claimed' };
    }

    // determine if the gift is owned by the current user
    const isOwner = gift?.ownerId === user.id;
    if (isOwner) {
      return { error: 'You cannot claim your own gift' };
    }

    await db.gift.update({
      where: {
        id,
      },
      data: {
        claimed: true,
        claimedBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    revalidateGiftRelatedCaches();
    return { success: true, message: `You claimed ${gift?.name}` };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
};

export const unclaimGift = async (id: string) => {
  try {
    const { user } = await getSession();
    const giftId = id;

    if (!giftId) {
      return { error: 'Gift ID is required' };
    }

    const gift = await db.gift.findUnique({
      where: {
        id: giftId,
      },
      select: {
        claimedById: true,
        name: true,
      },
    });

    const isClaimed = gift?.claimedById === user.id;
    if (!isClaimed) {
      return { error: 'You have not claimed this gift' };
    }

    await db.gift.update({
      where: {
        id: giftId,
      },
      data: {
        claimed: false,
        claimedBy: {
          disconnect: true,
        },
      },
    });
    revalidateGiftRelatedCaches();
    return { success: true, message: `You unclaimed ${gift?.name}` };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
};

export const updateUser = async (
  id: string,
  data: {
    name: string;
    address: string;
    sizes: {
      pants: string;
      shirt: string;
      shoes: string;
    };
  },
) => {
  try {
    await db.user.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        pant_size: data.sizes.pants,
        shirt_size: data.sizes.shirt,
        shoe_size: data.sizes.shoes,
      },
    });
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
};

export const joinWishlist = async (wishlistId: string, pin?: string) => {
  try {
    const { user } = await getSession();

    // Get the wishlist to check its password
    const wishlist = await db.wishlist.findUnique({
      where: { id: wishlistId },
      select: { password: true },
    });

    if (!wishlist) {
      return { error: 'Wishlist not found' };
    }

    // Only validate pin if the wishlist has a password
    if (wishlist.password) {
      if (!pin) {
        return { error: 'Pin is required to join this wishlist' };
      }

      // Validate pin format
      if (!/^\d{4}$/.test(pin)) {
        return { error: 'Pin must be 4 digits' };
      }

      if (wishlist.password !== pin) {
        return { error: 'Invalid pin' };
      }
    }

    await db.wishlist.update({
      where: { id: wishlistId },
      data: {
        members: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    revalidateGiftRelatedCaches();
    return { success: true, message: 'Successfully joined wishlist' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
};

export const leaveWishlist = async (wishlistId: string) => {
  try {
    const { user } = await getSession();
    await db.wishlist.update({
      where: { id: wishlistId },
      data: {
        members: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });
    revalidateGiftRelatedCaches();
    return { success: true, message: 'Successfully left wishlist' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
};

export const handleWishlistAction = async (
  wishlistId: string,
  isMember: boolean,
  pin?: string,
) => {
  if (isMember) {
    return leaveWishlist(wishlistId);
  }

  return joinWishlist(wishlistId, pin);
};

// Secret Santa actions
export const getPeopleForSecretSanta = async () => {
  try {
    const { user } = await getSession();

    // Fetch all users in the same wishlists as the current user, including the current user
    const people = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      where: {
        wishlists: {
          some: {
            members: { some: { id: user.id } },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return { success: true, people };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong fetching people' };
  }
};

export const createSecretSantaEvent = async (name: string) => {
  try {
    const { user } = await getSession();
    const event = await db.secretSantaEvent.create({
      data: {
        name,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    revalidateTag('secretSanta');
    return {
      success: true,
      id: event.id,
      message: `${name} has been created.`,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong creating the Secret Santa event' };
  }
};

export const addParticipantsToSecretSantaEvent = async (
  eventId: string,
  participantIds: string[],
) => {
  try {
    const { user } = await getSession();

    // Check if the event exists and is created by the current user
    const event = await db.secretSantaEvent.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!event) {
      return { error: 'Secret Santa event not found' };
    }

    if (event.createdById !== user.id) {
      return {
        error: 'You do not have permission to modify this Secret Santa event',
      };
    }

    // Make sure participants aren't already assigned
    if (event.participants.some((p) => p.assignedToId !== null)) {
      return {
        error: 'Cannot add participants after assignments have been made',
      };
    }

    // Add participants
    const _participantData = participantIds.map((userId) => ({
      userId,
      eventId,
    }));

    await db.$transaction(
      participantIds.map((userId) =>
        db.secretSantaParticipant.upsert({
          where: {
            eventId_userId: {
              eventId,
              userId,
            },
          },
          update: {},
          create: {
            event: {
              connect: {
                id: eventId,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        }),
      ),
    );

    revalidateTag('secretSanta');
    return { success: true, message: 'Participants added successfully' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong adding participants' };
  }
};

export const removeParticipantFromSecretSantaEvent = async (
  eventId: string,
  participantId: string,
) => {
  try {
    const { user } = await getSession();

    // Check if the event exists and is created by the current user
    const event = await db.secretSantaEvent.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!event) {
      return { error: 'Secret Santa event not found' };
    }

    if (event.createdById !== user.id) {
      return {
        error: 'You do not have permission to modify this Secret Santa event',
      };
    }

    // Make sure participants aren't already assigned
    if (event.participants.some((p) => p.assignedToId !== null)) {
      return {
        error: 'Cannot remove participants after assignments have been made',
      };
    }

    await db.secretSantaParticipant.delete({
      where: {
        eventId_userId: {
          eventId,
          userId: participantId,
        },
      },
    });

    revalidateTag('secretSanta');
    return { success: true, message: 'Participant removed successfully' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong removing the participant' };
  }
};

export const assignSecretSantaParticipants = async (eventId: string) => {
  try {
    const { user } = await getSession();

    // Check if the event exists and is created by the current user
    const event = await db.secretSantaEvent.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!event) {
      return { error: 'Secret Santa event not found' };
    }

    if (event.createdById !== user.id) {
      return {
        error: 'You do not have permission to modify this Secret Santa event',
      };
    }

    // Make sure we have enough participants
    if (event.participants.length < 3) {
      return { error: 'Need at least 3 participants for Secret Santa' };
    }

    // Make sure participants aren't already assigned
    if (event.participants.some((p) => p.assignedToId !== null)) {
      return { error: 'Participants have already been assigned' };
    }

    // Get all participant IDs
    const participantIds = event.participants.map((p) => p.userId);

    // Fetch exclusion pairs for all participants
    const participantsWithExclusions = await db.user.findMany({
      where: {
        id: { in: participantIds },
      },
      select: {
        id: true,
        secretSantaDoNotMatchWith: {
          select: {
            id: true,
          },
        },
      },
    });

    const exclusionMap = new Map<string, Set<string>>();
    participantsWithExclusions.forEach((p) => {
      const excludedIds = new Set(p.secretSantaDoNotMatchWith.map((e) => e.id));
      exclusionMap.set(p.id, excludedIds);
    });

    // Fetch historical assignments from previous events (current year and previous year)
    const currentYear = new Date().getFullYear();
    const previousYearStart = new Date(currentYear - 1, 0, 1);

    const historicalAssignments = await db.secretSantaParticipant.findMany({
      where: {
        userId: { in: participantIds },
        assignedToId: { not: null },
        event: {
          createdAt: { gte: previousYearStart },
          id: { not: eventId },
        },
      },
      select: {
        userId: true,
        assignedToId: true,
      },
    });

    const historicalMap = new Map<string, Set<string>>();
    historicalAssignments.forEach((assignment) => {
      if (!assignment.assignedToId) return;
      if (!historicalMap.has(assignment.userId)) {
        historicalMap.set(assignment.userId, new Set());
      }
      historicalMap.get(assignment.userId)!.add(assignment.assignedToId);
    });

    // Try to create valid assignments with constraints
    const assignments = createSecretSantaAssignments(
      participantIds,
      exclusionMap,
      historicalMap,
    );

    if (!assignments) {
      return {
        error:
          'Could not create valid assignments with current exclusions. Please review exclusion pairs.',
      };
    }

    // Validate assignments before saving
    const givers = new Set(assignments.map((a) => a.userId));
    const receivers = new Set(assignments.map((a) => a.assignedToId));

    console.log('Assignment validation:', {
      totalParticipants: participantIds.length,
      totalAssignments: assignments.length,
      uniqueGivers: givers.size,
      uniqueReceivers: receivers.size,
      participantIds: participantIds.sort(),
      giverIds: Array.from(givers).sort(),
      receiverIds: Array.from(receivers).sort(),
      assignments: assignments.map((a) => `${a.userId} -> ${a.assignedToId}`),
    });

    // Check if everyone is accounted for
    const missingGivers = participantIds.filter((id) => !givers.has(id));
    const missingReceivers = participantIds.filter((id) => !receivers.has(id));

    if (missingGivers.length > 0 || missingReceivers.length > 0) {
      console.error('VALIDATION FAILED:', {
        missingGivers,
        missingReceivers,
      });
      return {
        error: `Assignment validation failed. Missing givers: ${missingGivers.length}, Missing receivers: ${missingReceivers.length}`,
      };
    }

    // Update each participant with their assignment
    await Promise.all(
      assignments.map(({ userId, assignedToId }) =>
        db.secretSantaParticipant.update({
          where: {
            eventId_userId: {
              eventId,
              userId,
            },
          },
          data: {
            assignedTo: {
              connect: {
                id: assignedToId,
              },
            },
            assignedBy: {
              connect: {
                id: user.id,
              },
            },
          },
        }),
      ),
    );

    revalidateTag('secretSanta');
    return { success: true, message: 'Secret Santa assignments completed!' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong making the assignments' };
  }
};

// Helper function to create Secret Santa assignments with constraints
function createSecretSantaAssignments(
  participantIds: string[],
  exclusionMap: Map<string, Set<string>>,
  historicalMap: Map<string, Set<string>>,
): Array<{ userId: string; assignedToId: string }> | null {
  const n = participantIds.length;
  const maxAttempts = 1000;

  console.log('Creating Secret Santa assignments:', {
    participantCount: n,
    participantIds: participantIds.sort(),
    exclusions: Array.from(exclusionMap.entries()).map(([id, excluded]) => ({
      userId: id,
      excludedIds: Array.from(excluded),
    })),
  });

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Shuffle participant order for randomness
    const shuffledIds = [...participantIds].sort(() => Math.random() - 0.5);

    // Try to find a valid assignment using backtracking
    const result = backtrackAssignment(
      shuffledIds,
      [],
      new Set(participantIds),
      exclusionMap,
      historicalMap,
    );

    if (result) {
      console.log(`Found valid assignment on attempt ${attempt + 1}`);
      return result;
    }
  }

  console.error(
    'Failed to find valid assignment after',
    maxAttempts,
    'attempts',
  );
  return null; // Could not find valid assignment
}

// Backtracking helper to find valid Secret Santa assignments
function backtrackAssignment(
  remainingGivers: string[],
  currentAssignments: Array<{ userId: string; assignedToId: string }>,
  availableReceivers: Set<string>,
  exclusionMap: Map<string, Set<string>>,
  historicalMap: Map<string, Set<string>>,
): Array<{ userId: string; assignedToId: string }> | null {
  // Base case: all givers have been assigned
  if (remainingGivers.length === 0) {
    return currentAssignments;
  }

  const giverId = remainingGivers[0];
  const excluded = exclusionMap.get(giverId) || new Set();
  const historical = historicalMap.get(giverId) || new Set();

  // Get all valid candidates for this giver
  const candidates = Array.from(availableReceivers).filter(
    (id) => id !== giverId && !excluded.has(id),
  );

  if (candidates.length === 0) {
    return null; // Dead end, backtrack
  }

  // Prefer non-historical matches but keep historical as backup
  const nonHistoricalCandidates = candidates.filter(
    (id) => !historical.has(id),
  );
  const historicalCandidates = candidates.filter((id) => historical.has(id));

  // Shuffle both lists for randomness
  const shuffledNonHistorical = nonHistoricalCandidates.sort(
    () => Math.random() - 0.5,
  );
  const shuffledHistorical = historicalCandidates.sort(
    () => Math.random() - 0.5,
  );

  // Try non-historical first, then historical
  const orderedCandidates = [...shuffledNonHistorical, ...shuffledHistorical];

  // Try each candidate
  for (const recipientId of orderedCandidates) {
    // Make the assignment
    const newAssignments = [
      ...currentAssignments,
      { userId: giverId, assignedToId: recipientId },
    ];
    const newAvailable = new Set(availableReceivers);
    newAvailable.delete(recipientId);

    // Recurse
    const result = backtrackAssignment(
      remainingGivers.slice(1),
      newAssignments,
      newAvailable,
      exclusionMap,
      historicalMap,
    );

    if (result) {
      return result; // Found a valid complete assignment
    }

    // If result is null, try next candidate (backtrack)
  }

  return null; // No valid assignment found with this giver
}

// Admin actions
const ADMIN_EMAIL = 'jonathan@pulsifer.ca';

const isAdmin = (userEmail: string) => {
  return userEmail === ADMIN_EMAIL;
};

export const getSecretSantaExclusions = async () => {
  try {
    const { user } = await getSession();

    if (!isAdmin(user.email)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    const users = await db.user.findMany({
      where: {
        secretSantaDoNotMatchWith: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        secretSantaDoNotMatchWith: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Convert to exclusion pair format for easier UI handling
    const exclusions: Array<{
      user1: { id: string; name: string | null; email: string };
      user2: { id: string; name: string | null; email: string };
    }> = [];

    const processedPairs = new Set<string>();

    users.forEach((user) => {
      user.secretSantaDoNotMatchWith.forEach((excludedUser) => {
        const pairKey = [user.id, excludedUser.id].sort().join('-');
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          exclusions.push({
            user1: { id: user.id, name: user.name, email: user.email },
            user2: {
              id: excludedUser.id,
              name: excludedUser.name,
              email: excludedUser.email,
            },
          });
        }
      });
    });

    return { exclusions };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong fetching exclusions' };
  }
};

export const createSecretSantaExclusion = async (
  user1Id: string,
  user2Id: string,
) => {
  try {
    const { user } = await getSession();

    if (!isAdmin(user.email)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    if (user1Id === user2Id) {
      return { error: 'Cannot exclude a user from themselves' };
    }

    // Check if exclusion already exists (in either direction)
    const existingExclusion = await db.user.findFirst({
      where: {
        id: user1Id,
        secretSantaDoNotMatchWith: {
          some: {
            id: user2Id,
          },
        },
      },
    });

    if (existingExclusion) {
      return { error: 'This exclusion already exists' };
    }

    // Create bidirectional exclusion
    await db.$transaction([
      db.user.update({
        where: { id: user1Id },
        data: {
          secretSantaDoNotMatchWith: {
            connect: { id: user2Id },
          },
        },
      }),
      db.user.update({
        where: { id: user2Id },
        data: {
          secretSantaDoNotMatchWith: {
            connect: { id: user1Id },
          },
        },
      }),
    ]);

    revalidateTag('secretSanta');
    return { success: true, message: 'Exclusion created successfully' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong creating the exclusion' };
  }
};

export const deleteSecretSantaExclusion = async (
  user1Id: string,
  user2Id: string,
) => {
  try {
    const { user } = await getSession();

    if (!isAdmin(user.email)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    // Remove bidirectional exclusion
    await db.$transaction([
      db.user.update({
        where: { id: user1Id },
        data: {
          secretSantaDoNotMatchWith: {
            disconnect: { id: user2Id },
          },
        },
      }),
      db.user.update({
        where: { id: user2Id },
        data: {
          secretSantaDoNotMatchWith: {
            disconnect: { id: user1Id },
          },
        },
      }),
    ]);

    revalidateTag('secretSanta');
    return { success: true, message: 'Exclusion removed successfully' };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong removing the exclusion' };
  }
};

export const getAllUsersForExclusions = async () => {
  try {
    const { user } = await getSession();

    if (!isAdmin(user.email)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return { users };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong fetching users' };
  }
};

export const deleteSecretSantaEvent = async (eventId: string) => {
  try {
    const { user } = await getSession();

    if (!isAdmin(user.email)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    // Delete all participants first (cascade should handle this, but being explicit)
    await db.secretSantaParticipant.deleteMany({
      where: { eventId },
    });

    // Delete the event
    await db.secretSantaEvent.delete({
      where: { id: eventId },
    });

    revalidateTag('secretSanta');
    return {
      success: true,
      message: 'Secret Santa event deleted successfully',
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong deleting the Secret Santa event' };
  }
};

export const getAllSecretSantaEventsAdmin = async () => {
  try {
    const { user } = await getSession();

    if (!isAdmin(user.email)) {
      return { error: 'Unauthorized: Admin access required' };
    }

    const events = await db.secretSantaEvent.findMany({
      include: {
        participants: {
          include: {
            user: true,
            assignedTo: true,
          },
        },
        createdBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { events };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong fetching Secret Santa events' };
  }
};
