/**
 * What may this viewer act on.
 *
 * The sibling of `lib/db/visibility.ts`, and the other half of the same
 * question. `visibility.ts` answers *what may this viewer see*; this answers
 * *what may this viewer change*. Both return Prisma `where` builders rather
 * than booleans, so a row the viewer may not act on is never loaded — instead
 * of loaded by id and then judged in memory, which is the shape AGENTS.md
 * already forbids for people and which the two hand-written checks this module
 * replaces both had.
 *
 * ADR-0002: authority is a property of objects and of subjects, never of
 * people. Nothing here reads a role, and nothing here is granted.
 */

import type { Prisma } from '@/prisma/generated/client';

/** The Wish is about you. Archiving is this and nothing wider. */
export function subjectOfWhere(viewerId: string): Prisma.WishWhereInput {
  return { subjectId: viewerId };
}

/**
 * Wishes the viewer may edit or delete.
 *
 * Wider than `subjectOfWhere` on purpose: a Suggestion someone made for you is
 * still theirs to correct, and deleting is how they withdraw it. Archiving is
 * *not* here — a proposer archiving their own Suggestion strands the row past
 * every reader, because the subject cannot see Suggestions and every other
 * query filters `archived: false`.
 */
export function editableWishWhere(viewerId: string): Prisma.WishWhereInput {
  return { OR: [subjectOfWhere(viewerId), { proposerId: viewerId }] };
}

/** The Secret Santa Event is yours: you opened it. */
export function organiserOfWhere(
  viewerId: string,
): Prisma.SecretSantaEventWhereInput {
  return { createdById: viewerId };
}
