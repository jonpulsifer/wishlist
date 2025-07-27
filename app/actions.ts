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

    // Shuffle participant IDs to create random assignments
    const shuffledIds = [...participantIds].sort(() => Math.random() - 0.5);

    // Assign each participant to the next person in the shuffled list
    const assignments = participantIds.map((userId, index) => {
      const nextIndex = (index + 1) % participantIds.length;
      return {
        userId,
        assignedToId: shuffledIds[nextIndex],
        assignedById: user.id,
      };
    });

    // Update each participant with their assignment
    await Promise.all(
      assignments.map(({ userId, assignedToId, assignedById }) =>
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
                id: assignedById,
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
