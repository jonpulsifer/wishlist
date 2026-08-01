'use server';

import { z } from 'zod';
import { ActionError, defineAction } from '@/lib/actions/define';
import db from '@/lib/db/client';
import { personRefSelect } from '@/lib/db/projections';
import { visiblePeopleWhere } from '@/lib/db/visibility';
import {
  drawAssignments,
  toExclusionMap,
  toHistoryMap,
} from '@/lib/secret-santa/draw';
import {
  eventIdSchema,
  exclusionPairSchema,
  openEventSchema,
} from '@/lib/secret-santa/schema';

/** People the viewer may put in an event — anyone they share a Wishlist with. */
export const getPeopleForSecretSanta = defineAction({}, async ({ viewer }) => {
  const people = await db.user.findMany({
    select: personRefSelect,
    where: visiblePeopleWhere(viewer.id),
    orderBy: { name: 'asc' },
  });
  return { people };
});

/**
 * Create an Event and its Participants in one transaction.
 *
 * Replaces the previous three-call wizard, which created the Event on step one
 * and added Participants on step two — so abandoning the flow left an Event
 * with no Participants and nothing to clean it up.
 */
export const openSecretSantaEvent = defineAction(
  { input: openEventSchema, invalidates: ['secretSanta'] },
  async ({ viewer, input }) => {
    const event = await db.$transaction(async (tx) => {
      const created = await tx.secretSantaEvent.create({
        data: { name: input.name, createdBy: { connect: { id: viewer.id } } },
      });
      await tx.secretSantaParticipant.createMany({
        data: input.participantIds.map((userId) => ({
          eventId: created.id,
          userId,
        })),
      });
      return created;
    });

    return { id: event.id, message: `${input.name} has been created.` };
  },
);

/**
 * Make the draw and record it.
 *
 * The draw itself lives in `lib/secret-santa/draw` and knows nothing about the
 * database; this action loads its inputs, calls it, and persists the result in
 * a single transaction.
 */
export const assignSecretSantaParticipants = defineAction(
  { input: eventIdSchema, invalidates: ['secretSanta'] },
  async ({ viewer, input: { eventId } }) => {
    const event = await db.secretSantaEvent.findUnique({
      where: { id: eventId },
      include: { participants: true },
    });

    if (!event) throw new ActionError('Secret Santa event not found');
    if (event.createdById !== viewer.id) {
      throw new ActionError(
        'You do not have permission to modify this Secret Santa event',
      );
    }
    if (event.participants.some((p) => p.assignedToId !== null)) {
      throw new ActionError('Participants have already been assigned');
    }

    const participantIds = event.participants.map((p) => p.userId);

    // Only the previous year and this one count as "recent" for the soft
    // constraint.
    const historyFrom = new Date(new Date().getFullYear() - 1, 0, 1);

    const [exclusionRows, historyRows] = await Promise.all([
      db.user.findMany({
        where: { id: { in: participantIds } },
        select: {
          id: true,
          secretSantaDoNotMatchWith: { select: { id: true } },
        },
      }),
      db.secretSantaParticipant.findMany({
        where: {
          userId: { in: participantIds },
          assignedToId: { not: null },
          event: { createdAt: { gte: historyFrom }, id: { not: eventId } },
        },
        select: { userId: true, assignedToId: true },
      }),
    ]);

    const result = drawAssignments({
      participantIds,
      exclusions: toExclusionMap(exclusionRows),
      history: toHistoryMap(historyRows),
    });

    if (!result.ok) throw new ActionError(result.message);

    // One transaction: a partial write used to leave the event half-assigned,
    // which the "already been assigned" guard above then blocked forever.
    await db.$transaction(
      result.pairings.map(({ userId, assignedToId }) =>
        db.secretSantaParticipant.update({
          where: { eventId_userId: { eventId, userId } },
          data: {
            assignedTo: { connect: { id: assignedToId } },
            assignedBy: { connect: { id: viewer.id } },
          },
        }),
      ),
    );

    return { message: 'Secret Santa assignments completed!' };
  },
);

/** Exclusion pairs, collapsed to one row per pair. */
export const getSecretSantaExclusions = defineAction(
  { capability: 'manage:secret-santa' },
  async () => {
    const users = await db.user.findMany({
      where: { secretSantaDoNotMatchWith: { some: {} } },
      select: {
        id: true,
        name: true,
        email: true,
        secretSantaDoNotMatchWith: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    const seen = new Set<string>();
    const exclusions: Array<{
      user1: { id: string; name: string | null; email: string };
      user2: { id: string; name: string | null; email: string };
    }> = [];

    for (const user of users) {
      for (const other of user.secretSantaDoNotMatchWith) {
        const pairKey = [user.id, other.id].sort().join('-');
        if (seen.has(pairKey)) continue;
        seen.add(pairKey);
        exclusions.push({
          user1: { id: user.id, name: user.name, email: user.email },
          user2: { id: other.id, name: other.name, email: other.email },
        });
      }
    }

    return { exclusions };
  },
);

export const createSecretSantaExclusion = defineAction(
  {
    capability: 'manage:secret-santa',
    input: exclusionPairSchema,
    invalidates: ['secretSanta'],
  },
  async ({ input: { user1Id, user2Id } }) => {
    const existing = await db.user.findFirst({
      where: {
        id: user1Id,
        secretSantaDoNotMatchWith: { some: { id: user2Id } },
      },
      select: { id: true },
    });
    if (existing) throw new ActionError('This exclusion already exists');

    // Both directions, so the draw sees the pair whichever side it reads.
    await db.$transaction([
      db.user.update({
        where: { id: user1Id },
        data: { secretSantaDoNotMatchWith: { connect: { id: user2Id } } },
      }),
      db.user.update({
        where: { id: user2Id },
        data: { secretSantaDoNotMatchWith: { connect: { id: user1Id } } },
      }),
    ]);

    return { message: 'Exclusion created successfully' };
  },
);

export const deleteSecretSantaExclusion = defineAction(
  {
    capability: 'manage:secret-santa',
    input: exclusionPairSchema,
    invalidates: ['secretSanta'],
  },
  async ({ input: { user1Id, user2Id } }) => {
    await db.$transaction([
      db.user.update({
        where: { id: user1Id },
        data: { secretSantaDoNotMatchWith: { disconnect: { id: user2Id } } },
      }),
      db.user.update({
        where: { id: user2Id },
        data: { secretSantaDoNotMatchWith: { disconnect: { id: user1Id } } },
      }),
    ]);

    return { message: 'Exclusion removed successfully' };
  },
);

export const getAllUsersForExclusions = defineAction(
  { capability: 'manage:secret-santa' },
  async () => {
    const users = await db.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });
    return { users };
  },
);

export const deleteSecretSantaEvent = defineAction(
  {
    capability: 'manage:secret-santa',
    input: z.string().uuid('Invalid event'),
    invalidates: ['secretSanta'],
  },
  async ({ input: eventId }) => {
    await db.$transaction([
      db.secretSantaParticipant.deleteMany({ where: { eventId } }),
      db.secretSantaEvent.delete({ where: { id: eventId } }),
    ]);
    return { message: 'Secret Santa event deleted successfully' };
  },
);

export const getAllSecretSantaEventsAdmin = defineAction(
  { capability: 'manage:secret-santa' },
  async () => {
    const events = await db.secretSantaEvent.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        createdBy: { select: { id: true, name: true, email: true } },
        participants: {
          select: {
            id: true,
            user: { select: { id: true, name: true, email: true } },
            assignedTo: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { events };
  },
);
