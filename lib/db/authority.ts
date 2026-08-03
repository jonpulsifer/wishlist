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

/** The Gift is about you. */
export function subjectOfWhere(viewerId: string): Prisma.GiftWhereInput {
  return { ownerId: viewerId };
}

/**
 * Gifts the viewer may edit, archive or delete.
 *
 * Wider than `subjectOfWhere` on purpose: today a Gift someone else added for
 * you is still theirs to correct. Step 12 narrows this to the subject alone,
 * when `subjectId` arrives and a Suggestion stops being editable by the person
 * who made it.
 */
export function editableGiftWhere(viewerId: string): Prisma.GiftWhereInput {
  return { OR: [subjectOfWhere(viewerId), { createdById: viewerId }] };
}

/** The Secret Santa Event is yours: you opened it. */
export function organiserOfWhere(
  viewerId: string,
): Prisma.SecretSantaEventWhereInput {
  return { createdById: viewerId };
}
