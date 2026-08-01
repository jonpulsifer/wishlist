'use server';

import { z } from 'zod';
import { ActionError, defineAction } from '@/lib/actions/define';
import db from '@/lib/db/client';
import { visibleProfileWhere } from '@/lib/db/visibility';

const optionalText = z.string().max(255).optional();

const updateUserSchema = z.object({
  name: optionalText,
  address: optionalText,
  sizes: z.object({
    pants: optionalText,
    shirt: optionalText,
    shoes: optionalText,
  }),
});

/**
 * Update the viewer's own profile.
 *
 * The previous version took a user id from the caller and never resolved a
 * session, so any client could write to any profile.
 */
export const updateUser = defineAction(
  { input: updateUserSchema, invalidates: ['users'] },
  async ({ viewer, input }) => {
    await db.user.update({
      where: { id: viewer.id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.address !== undefined ? { address: input.address } : {}),
        ...(input.sizes.pants !== undefined
          ? { pant_size: input.sizes.pants }
          : {}),
        ...(input.sizes.shirt !== undefined
          ? { shirt_size: input.sizes.shirt }
          : {}),
        ...(input.sizes.shoes !== undefined
          ? { shoe_size: input.sizes.shoes }
          : {}),
      },
    });

    return { message: 'Profile updated' };
  },
);

export const getAIRecommendationsForUser = defineAction(
  { input: z.string().min(1, 'User is required') },
  async ({ viewer, input: targetUserId }) => {
    const targetUser = await db.user.findFirst({
      where: visibleProfileWhere(viewer.id, targetUserId),
      select: { id: true, name: true, email: true },
    });

    if (!targetUser) {
      throw new ActionError('User not found or you do not have access');
    }

    // Imported lazily so the OpenAI client isn't pulled into every request.
    const { getRecommendationsForHomePage } = await import('@/lib/ai');
    const recommendations = await getRecommendationsForHomePage(
      targetUserId,
      viewer.id,
    );

    return { recommendations, targetUser };
  },
);
