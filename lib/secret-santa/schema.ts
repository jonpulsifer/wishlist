/**
 * The shape of an Exchange at intake.
 *
 * Imported by both the create form and the action behind it, so the rules are
 * stated once. Previously the 2-character minimum existed only in the browser
 * and the action took a raw unvalidated string, while the "at least three
 * participants" rule was written three times — as a button predicate, as a
 * guard in the assign action, and inside the draw.
 *
 * Client-safe: no Prisma, no `next/*`.
 */

import { z } from 'zod';
import { MINIMUM_PARTICIPANTS } from './draw';

export const exchangeNameSchema = z
  .string()
  .trim()
  .min(2, 'Event name must be at least 2 characters')
  .max(100, 'Event name must be at most 100 characters');

export const openExchangeSchema = z.object({
  name: exchangeNameSchema,
  /** The Family it is held for. Its members are the only eligible participants. */
  familyId: z.string().uuid('Invalid family'),
  participantIds: z
    .array(z.string().uuid('Invalid participant'))
    .min(
      MINIMUM_PARTICIPANTS,
      `Pick at least ${MINIMUM_PARTICIPANTS} people for Secret Santa`,
    )
    .refine(
      (ids) => new Set(ids).size === ids.length,
      'The same person was selected twice',
    ),
});

export type OpenExchangeInput = z.infer<typeof openExchangeSchema>;

export const exchangeIdSchema = z.object({
  exchangeId: z.string().uuid('Invalid exchange'),
});

/**
 * The other person in an exclusion. The viewer is always one end of it, taken
 * from the session rather than the form, so there is nothing to check about
 * whose exclusion this is.
 */
export const exclusionSchema = z.string().uuid('Invalid person');

export { MINIMUM_PARTICIPANTS };
