/**
 * Wish recommendations.
 *
 * One module, two output shapes. There used to be two exported functions that
 * repeated the same load → preferences → first name → prompt sequence and
 * differed only in whether they returned prose or a list, so the prompt drifted
 * between them and neither could be exercised.
 *
 * The completion client is accepted rather than constructed, which is what makes
 * the module testable: the OpenAI adapter in production, a canned one in a test.
 */

import type OpenAI from 'openai';
import { getFullUserForRecommendations } from './db/queries-cached';

export type WishRecommendation = {
  name: string;
  description: string;
  estimatedPrice?: string;
};

const MODEL = 'gpt-4o-mini';

/**
 * What this module needs from a completion service.
 *
 * Structurally satisfied by `OpenAI.chat.completions`, so the real client slots
 * in with no wrapper; a fake is one object literal.
 */
export type CompletionClient = {
  create: (
    body: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming,
  ) => Promise<OpenAI.Chat.ChatCompletion>;
};

// Constructed lazily, and imported lazily: the OpenAI client throws on a missing
// key at construction time, and this module is reachable from routes evaluated
// during `next build`, where OPENAI_API_KEY is not necessarily present.
let openai: OpenAI | undefined;
async function defaultClient(): Promise<CompletionClient> {
  if (!openai) {
    const { default: OpenAIClient } = await import('openai');
    openai = new OpenAIClient({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai.chat.completions;
}

/** The recipient, reduced to the two things the prompt actually uses. */
type Recipient = { firstName: string; preferences: string };

const SANTA_VOICE = `Ho ho ho! I'm Santa Claus, here to help you pick the perfect Christmas gifts for someone special. Based on their wishlist items (including both current and past gifts to understand their interests), suggest a wide variety of delightful and unique presents that will bring joy and cheer this holiday season. Format your output in plain text, no markdown. Do not recommend items that are part of the wishlist already. Respond playfully in only a few sentences. Begin your response with a fun summary about the recipient's gifts. Include your reasoning.`;

const EXPERT_VOICE = `You are a gift recommendation expert. Based on a user's wishlist (including both current and past gifts), suggest 5 unique and thoughtful gift ideas. Each recommendation should include a name, description, and estimated price range. Be creative and consider the user's interests shown through their gift history. Do not recommend items that are already on their list.`;

/** The one place the recipient is described to the model. */
function describe({ firstName, preferences }: Recipient): string {
  return `The person I'm buying for is named: ${firstName} and has these items on their wishlist (current and past): ${preferences}.`;
}

const RECOMMENDATION_TOOL: OpenAI.Chat.ChatCompletionTool = {
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
};

/**
 * Load the recipient, scoped to the viewer.
 *
 * `null` means the viewer shares no Wishlist with this person and has no
 * business asking. Archived Wishes are deliberately included: they say as much
 * about someone's interests as the current list does.
 */
async function loadRecipient(
  personId: string,
  viewerId: string,
): Promise<Recipient | null> {
  const person = await getFullUserForRecommendations(personId, viewerId);
  if (!person) return null;
  return {
    firstName: person.name?.split(' ')[0] || 'someone mysterious',
    preferences: person.wishes.map((wish) => wish.name).join(', '),
  };
}

export type RecommendOptions = {
  personId: string;
  viewerId: string;
  client?: CompletionClient;
};

/**
 * Recommendations as prose, in Santa's voice.
 *
 * `null` — rather than an empty string — means the viewer may not see this
 * person, which the route handler turns into a 404.
 */
export async function recommendWishesAsProse({
  personId,
  viewerId,
  client,
}: RecommendOptions): Promise<string | null> {
  const recipient = await loadRecipient(personId, viewerId);
  if (!recipient) return null;

  const completions = client ?? (await defaultClient());
  const completion = await completions.create({
    model: MODEL,
    temperature: 1.0,
    messages: [
      { role: 'system', content: SANTA_VOICE },
      {
        role: 'user',
        content: `${describe(recipient)} What would Santa recommend as great Christmas gifts for them?`,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? null;
}

/**
 * Recommendations as a list.
 *
 * Empty when the viewer may not see this person, when they have no Wishes to
 * reason from, or when the model declines the tool call.
 */
export async function recommendWishesAsList({
  personId,
  viewerId,
  client,
}: RecommendOptions): Promise<WishRecommendation[]> {
  const recipient = await loadRecipient(personId, viewerId);
  if (!recipient?.preferences) return [];

  const completions = client ?? (await defaultClient());
  const completion = await completions.create({
    model: MODEL,
    temperature: 1.0,
    tools: [RECOMMENDATION_TOOL],
    tool_choice: {
      type: 'function',
      function: { name: 'get_gift_recommendations' },
    },
    messages: [
      { role: 'system', content: EXPERT_VOICE },
      {
        role: 'user',
        content: `${describe(recipient)} Based on their gift history and interests, what would you recommend as great gift ideas for them?`,
      },
    ],
  });

  return parseRecommendations(completion);
}

/** Pull the tool call out of a completion, or give up quietly. */
export function parseRecommendations(
  completion: OpenAI.Chat.ChatCompletion,
): WishRecommendation[] {
  const call = completion.choices[0]?.message?.tool_calls?.[0];
  if (
    call?.type !== 'function' ||
    call.function.name !== 'get_gift_recommendations'
  ) {
    return [];
  }

  try {
    const parsed = JSON.parse(call.function.arguments || '{}');
    return Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
  } catch {
    // The model is asked for JSON, not promised to produce it.
    return [];
  }
}
