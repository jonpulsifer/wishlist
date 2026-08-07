'use server';

import { z } from 'zod';
import { ActionError, defineAction } from '@/lib/actions/define';
import { organiserOfWhere } from '@/lib/db/authority';
import db from '@/lib/db/client';
import { visibleFamiliesWhere, visibleProfileWhere } from '@/lib/db/visibility';
import { currentSeason, withinDrawHistory } from '@/lib/season';
import {
  drawAssignments,
  toExclusionMap,
  toHistoryMap,
} from '@/lib/secret-santa/draw';
import {
  exchangeIdSchema,
  exclusionSchema,
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

/**
 * Never match me with this person.
 *
 * An exclusion belongs to the two people in it, not to whoever runs the Draw
 * (ADR-0002). The viewer is one end of it by construction — taken from the
 * session, never from the form — so there is no authority question left to ask
 * beyond whether they may see the person they are naming.
 *
 * It binds both ways and it is written both ways, because the Draw reads it
 * from whichever side it reaches first.
 */
export const excludePerson = defineAction(
  { input: exclusionSchema, invalidates: ['secretSanta'] },
  async ({ viewer, input: otherId }) => {
    if (otherId === viewer.id) {
      throw new ActionError('You cannot exclude yourself');
    }

    const other = await db.user.findFirst({
      where: visibleProfileWhere(viewer.id, otherId),
      select: { id: true, name: true, email: true },
    });
    if (!other) throw new ActionError('Person not found');

    // `connect` on an existing edge is a no-op, so naming the same person twice
    // is not an error worth telling apart from success.
    await db.$transaction([
      db.user.update({
        where: { id: viewer.id },
        data: { excludes: { connect: { id: other.id } } },
      }),
      db.user.update({
        where: { id: other.id },
        data: { excludes: { connect: { id: viewer.id } } },
      }),
    ]);

    return {
      message: `You will not be matched with ${other.name || other.email}`,
    };
  },
);

export const unexcludePerson = defineAction(
  { input: exclusionSchema, invalidates: ['secretSanta'] },
  async ({ viewer, input: otherId }) => {
    await db.$transaction([
      db.user.update({
        where: { id: viewer.id },
        data: { excludes: { disconnect: { id: otherId } } },
      }),
      db.user.update({
        where: { id: otherId },
        data: { excludes: { disconnect: { id: viewer.id } } },
      }),
    ]);

    return { message: 'Exclusion removed' };
  },
);

/**
 * Delete an Exchange you opened.
 *
 * The Organiser's, and nobody else's: organising one Exchange confers nothing
 * over another, so there is no rank here to hold — only the row (ADR-0002).
 * Loaded through `organiserOfWhere`, so one the viewer did not open is never
 * found.
 */
export const deleteExchange = defineAction(
  {
    input: z.string().uuid('Invalid exchange'),
    invalidates: ['secretSanta'],
  },
  async ({ viewer, input: exchangeId }) => {
    const exchange = await db.exchange.findFirst({
      where: { id: exchangeId, ...organiserOfWhere(viewer.id) },
      select: { id: true },
    });
    if (!exchange) throw new ActionError('Secret Santa event not found');

    await db.$transaction([
      db.participant.deleteMany({ where: { exchangeId } }),
      db.exchange.delete({ where: { id: exchangeId } }),
    ]);
    return { message: 'Secret Santa event deleted successfully' };
  },
);
