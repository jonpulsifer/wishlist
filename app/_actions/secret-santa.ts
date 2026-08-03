'use server';

import { z } from 'zod';
import { ActionError, defineAction } from '@/lib/actions/define';
import { organiserOfWhere } from '@/lib/db/authority';
import db from '@/lib/db/client';
import { visiblePeopleWhere } from '@/lib/db/visibility';
import { currentSeason, withinDrawHistory } from '@/lib/season';
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
    // The participant list arrives from the client, so every id in it is
    // re-derived against what the viewer may actually see. Without this, any
    // signed-in person could name strangers by uuid and then read back their
    // assignments — they are the Organiser of the event they just opened.
    const visible = await db.user.count({
      where: {
        id: { in: input.participantIds },
        ...visiblePeopleWhere(viewer.id),
      },
    });
    if (visible !== input.participantIds.length) {
      throw new ActionError('Some of those people are not in your families');
    }

    const event = await db.$transaction(async (tx) => {
      const created = await tx.secretSantaEvent.create({
        data: {
          name: input.name,
          // The Occasion this is for, not the year the row was made. Opening
          // one in January means last Christmas, and the draw's history and
          // the current/past split both read this rather than `createdAt`.
          year: currentSeason().occasionYear,
          createdBy: { connect: { id: viewer.id } },
        },
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
    // Organiser-or-nothing, as a `where` rather than a comparison: an event
    // the viewer did not open is not loaded, so "not yours" and "no such
    // event" are the same answer.
    const event = await db.secretSantaEvent.findFirst({
      where: { id: eventId, ...organiserOfWhere(viewer.id) },
      include: { participants: true },
    });

    if (!event) throw new ActionError('Secret Santa event not found');
    if (event.participants.some((p) => p.assignedToId !== null)) {
      throw new ActionError('Participants have already been assigned');
    }

    const participantIds = event.participants.map((p) => p.userId);

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
          event: { ...withinDrawHistory(), id: { not: eventId } },
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
