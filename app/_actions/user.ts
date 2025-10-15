'use server';

import { revalidateTag } from 'next/cache';
import { getSession } from '@/app/auth';
import db from '@/lib/db/client';

export const updateUser = async (
  id: string,
  data: {
    name?: string;
    address?: string;
    sizes: {
      pants?: string;
      shirt?: string;
      shoes?: string;
    };
  },
) => {
  try {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.sizes.pants !== undefined) updateData.pant_size = data.sizes.pants;
    if (data.sizes.shirt !== undefined)
      updateData.shirt_size = data.sizes.shirt;
    if (data.sizes.shoes !== undefined) updateData.shoe_size = data.sizes.shoes;

    await db.user.update({
      where: { id },
      data: updateData,
    });

    // Revalidate user-related caches
    revalidateTag('users');

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong in the server action' };
  }
};

// AI Recommendations actions
export const getAIRecommendationsForUser = async (targetUserId: string) => {
  try {
    const { user } = await getSession();

    // Verify that the current user has access to this person
    const targetUser = await db.user.findFirst({
      where: {
        id: targetUserId,
        wishlists: {
          some: {
            members: { some: { id: user.id } },
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!targetUser) {
      return { error: 'User not found or you do not have access' };
    }

    // Dynamically import the AI module to avoid loading it unnecessarily
    const { getRecommendationsForHomePage } = await import('@/lib/ai');
    const recommendations = await getRecommendationsForHomePage(targetUserId);

    return {
      success: true,
      recommendations,
      targetUser,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Something went wrong getting AI recommendations' };
  }
};
