import OpenAI from 'openai';

import { getFullUserForRecommendations } from './db/queries-cached';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
});

export type GiftRecommendation = {
  name: string;
  description: string;
  estimatedPrice?: string;
};

export const getRecommendations = async (userId: string, viewerId: string) => {
  // Scoped read: `null` means the viewer shares no wishlist with this person.
  const user = await getFullUserForRecommendations(userId, viewerId);
  if (!user) return null;

  // Include ALL gifts (current and archived) to get a full picture of their interests
  const allGifts = user.gifts;
  const preferences = allGifts.map((gift) => gift.name).join(', ');
  const name = user.name?.split(' ')[0] || 'someone mysterious';

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Ho ho ho! I'm Santa Claus, here to help you pick the perfect Christmas gifts for someone special. Based on their wishlist items (including both current and past gifts to understand their interests), suggest a wide variety of delightful and unique presents that will bring joy and cheer this holiday season. Format your output in plain text, no markdown. Do not recommend items that are part of the wishlist already. Respond playfully in only a few sentences. Begin your response with a fun summary about the recipient's gifts. Include your reasoning.`,
      },
      {
        role: 'user',
        content: `The person I'm buying for is named: ${name} and has these items on their wishlist (current and past): ${preferences}. What would Santa recommend as great Christmas gifts for them?`,
      },
    ],
    temperature: 1.0,
  });

  return completion.choices[0]?.message?.content;
};

export const getRecommendationsForHomePage = async (
  userId: string,
  viewerId: string,
): Promise<GiftRecommendation[]> => {
  const user = await getFullUserForRecommendations(userId, viewerId);
  if (!user) return [];

  // Include ALL gifts (current and archived) to get a full picture of their interests
  const allGifts = user.gifts;
  const preferences = allGifts.map((gift) => gift.name).join(', ');
  const name = user.name?.split(' ')[0] || 'someone mysterious';

  if (!preferences) {
    return []; // Return empty if user has no gifts
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    tools: [
      {
        type: 'function',
        function: {
          name: 'get_gift_recommendations',
          description: 'Get gift recommendations for the user',
          parameters: {
            type: 'object',
            properties: {
              recommendations: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    estimatedPrice: { type: 'string' },
                  },
                  required: ['name', 'description'],
                },
              },
            },
          },
        },
      },
    ],
    tool_choice: {
      type: 'function',
      function: { name: 'get_gift_recommendations' },
    },
    messages: [
      {
        role: 'system',
        content: `You are a gift recommendation expert. Based on a user's wishlist (including both current and past gifts), suggest 5 unique and thoughtful gift ideas. Each recommendation should include a name, description, and estimated price range. Be creative and consider the user's interests shown through their gift history. Do not recommend items that are already on their list.`,
      },
      {
        role: 'user',
        content: `The person I'm buying for is named: ${name} and has these items on their wishlist (current and past): ${preferences}. Based on their gift history and interests, what would you recommend as great gift ideas for them?`,
      },
    ],
    temperature: 1.0,
  });

  const firstCall = completion.choices[0]?.message?.tool_calls?.[0];
  if (
    !firstCall ||
    firstCall.type !== 'function' ||
    firstCall.function.name !== 'get_gift_recommendations'
  ) {
    return [];
  }

  const { recommendations } = JSON.parse(firstCall.function.arguments || '{}');
  return recommendations;
};
