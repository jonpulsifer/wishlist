import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type OpenAI from 'openai';
import { parseRecommendations } from './ai.ts';

/** A completion carrying one tool call with the given raw arguments. */
function completionWithToolCall(
  name: string,
  args: string,
): OpenAI.Chat.ChatCompletion {
  return {
    choices: [
      {
        message: {
          role: 'assistant',
          content: null,
          tool_calls: [
            {
              id: 'call-1',
              type: 'function',
              function: { name, arguments: args },
            },
          ],
        },
      },
    ],
  } as unknown as OpenAI.Chat.ChatCompletion;
}

const empty = { choices: [] } as unknown as OpenAI.Chat.ChatCompletion;

describe('parseRecommendations', () => {
  it('reads the recommendations out of the tool call', () => {
    const completion = completionWithToolCall(
      'get_gift_recommendations',
      JSON.stringify({
        recommendations: [
          {
            name: 'A kite',
            description: 'For windy days',
            estimatedPrice: '$20',
          },
        ],
      }),
    );

    assert.deepEqual(parseRecommendations(completion), [
      { name: 'A kite', description: 'For windy days', estimatedPrice: '$20' },
    ]);
  });

  it('gives up quietly when the model answered in prose', () => {
    assert.deepEqual(parseRecommendations(empty), []);
  });

  it('gives up quietly when the model called a different tool', () => {
    const completion = completionWithToolCall('something_else', '{}');
    assert.deepEqual(parseRecommendations(completion), []);
  });

  it('gives up quietly on malformed JSON', () => {
    // The model is asked for JSON, not promised to produce it.
    const completion = completionWithToolCall(
      'get_gift_recommendations',
      '{"recommendations": [',
    );
    assert.deepEqual(parseRecommendations(completion), []);
  });

  it('gives up quietly on empty arguments', () => {
    const completion = completionWithToolCall('get_gift_recommendations', '');
    assert.deepEqual(parseRecommendations(completion), []);
  });

  it('gives up quietly when recommendations is not a list', () => {
    const completion = completionWithToolCall(
      'get_gift_recommendations',
      JSON.stringify({ recommendations: 'a kite' }),
    );
    assert.deepEqual(parseRecommendations(completion), []);
  });
});
