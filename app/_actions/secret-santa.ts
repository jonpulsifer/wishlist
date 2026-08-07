'use server';

import { z } from 'zod';
import { ActionError, defineAction } from '@/lib/actions/define';
import { organiserOfWhere } from '@/lib/db/authority';
import db from '@/lib/db/client';
import { visibleFamiliesWhere } from '@/lib/db/visibility';
import { currentSeason, withinDrawHistory } from '@/lib/season';
import {
  drawAssignments,
  toExclusionMap,
  toHistoryMap,
} from '@/lib/secret-santa/draw';
import {
  exchangeIdSchema,
  exclusionPairSchema,
  openExchangeSchema,
} from '@/lib/secret-santa/schema';

/**
 * Create an Exchange and its Participants in one transaction.
 *
 * Replaces the previous three-call wizard, which created the Exchange on step
 * one and added Participants on step two — so abandoning the flow left one with
 * no Participants and nothing to clean it up.
 */
export const openExchange = defineAction(
  { input: openExchangeSchema, invalidates: ['secretSanta'] },
  async ({ viewer, input }) => {
    // Both halves arrive from the client, so both are re-derived: the Family
    // against the ones the viewer belongs to, and the participants against that
    // Family's members. Membership is the only visibility edge there is, so
    // drawing from anywhere else can pair someone with a person whose Wishes
    // they will never be allowed to see.
    const family = await db.family.findFirst({
      where: { id: input.familyId, ...visibleFamiliesWhere(viewer.id) },
      select: { id: true },
    });
    if (!family) throw new ActionError('That family is not one of yours');

    const members = await db.membership.count({
      where: { familyId: family.id, userId: { in: input.participantIds } },
    });
    if (members !== input.participantIds.length) {
      throw new ActionError('Some of those people are not in that family');
    }

    const exchange = await db.$transaction(async (tx) => {
      const created = await tx.exchange.create({
        data: {
          name: input.name,
          // The Occasion this is for, not the year the row was made. Opening
          // one in January means last Christmas, and the draw's history and
          // the current/past split both read this rather than `createdAt`.
          year: currentSeason().occasionYear,
          organiser: { connect: { id: viewer.id } },
          family: { connect: { id: family.id } },
        },
      });
      await tx.participant.createMany({
        data: input.participantIds.map((userId) => ({
          exchangeId: created.id,
          userId,
        })),
      });
      return created;
    });

    return { id: exchange.id, message: `${input.name} has been created.` };
  },
);

/**
 * Make the draw and record it.
 *
 * The draw itself lives in `lib/secret-santa/draw` and knows nothing about the
 * database; this action loads its inputs, calls it, and persists the result in
 * a single transaction.
 */
export const drawExchange = defineAction(
  { input: exchangeIdSchema, invalidates: ['secretSanta'] },
  async ({ viewer, input: { exchangeId } }) => {
    // Organiser-or-nothing, as a `where` rather than a comparison: an Exchange
    // the viewer did not open is not loaded, so "not yours" and "no such
    // exchange" are the same answer.
    const exchange = await db.exchange.findFirst({
      where: { id: exchangeId, ...organiserOfWhere(viewer.id) },
      include: { participants: true },
    });

    if (!exchange) throw new ActionError('Secret Santa event not found');
    if (exchange.participants.some((p) => p.assignedToId !== null)) {
      throw new ActionError('Participants have already been assigned');
    }

    const participantIds = exchange.participants.map((p) => p.userId);

    const [exclusionRows, historyRows] = await Promise.all([
      db.user.findMany({
        where: { id: { in: participantIds } },
        select: { id: true, excludes: { select: { id: true } } },
      }),
      db.participant.findMany({
        where: {
          userId: { in: participantIds },
          assignedToId: { not: null },
          exchange: { ...withinDrawHistory(), id: { not: exchangeId } },
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

    // One transaction: a partial write used to leave the exchange half-assigned,
    // which the "already been assigned" guard above then blocked forever.
    await db.$transaction(
      result.pairings.map(({ userId, assignedToId }) =>
        db.participant.update({
          where: { exchangeId_userId: { exchangeId, userId } },
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
      where: { id: user1Id, excludes: { some: { id: user2Id } } },
      select: { id: true },
    });
    if (existing) throw new ActionError('This exclusion already exists');

    // Both directions, so the draw sees the pair whichever side it reads.
    await db.$transaction([
      db.user.update({
        where: { id: user1Id },
        data: { excludes: { connect: { id: user2Id } } },
      }),
      db.user.update({
        where: { id: user2Id },
        data: { excludes: { connect: { id: user1Id } } },
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
        data: { excludes: { disconnect: { id: user2Id } } },
      }),
      db.user.update({
        where: { id: user2Id },
        data: { excludes: { disconnect: { id: user1Id } } },
      }),
    ]);

    return { message: 'Exclusion removed successfully' };
  },
);

export const deleteExchange = defineAction(
  {
    capability: 'manage:secret-santa',
    input: z.string().uuid('Invalid exchange'),
    invalidates: ['secretSanta'],
  },
  async ({ input: exchangeId }) => {
    await db.$transaction([
      db.participant.deleteMany({ where: { exchangeId } }),
      db.exchange.delete({ where: { id: exchangeId } }),
    ]);
    return { message: 'Secret Santa event deleted successfully' };
  },
);
