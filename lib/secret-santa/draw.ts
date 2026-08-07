/**
 * The Secret Santa draw.
 *
 * Deliberately free of Prisma, `next/*` and `'use server'`: the interface is
 * `drawAssignments(input, rng)` and nothing behind it touches I/O. That is what
 * makes it testable — the caller supplies the randomness, so a seeded generator
 * produces a reproducible draw.
 *
 * Rules, in the order they bind:
 *   1. Derangement — nobody draws themselves. Hard.
 *   2. Exclusion pairs — hard.
 *   3. Last year's pairing — soft, a preference only.
 */

export type ParticipantId = string;

export type DrawInput = {
  /** Everyone taking part. Duplicates are rejected. */
  participantIds: ParticipantId[];
  /** giver -> people the giver must not draw. Assumed symmetric by the caller. */
  exclusions: ReadonlyMap<ParticipantId, ReadonlySet<ParticipantId>>;
  /** giver -> people the giver drew recently. Avoided when possible. */
  history: ReadonlyMap<ParticipantId, ReadonlySet<ParticipantId>>;
};

export type Pairing = {
  userId: ParticipantId;
  assignedToId: ParticipantId;
};

export type DrawResult =
  | { ok: true; pairings: Pairing[] }
  | { ok: false; reason: DrawFailure; message: string };

export type DrawFailure =
  | 'too-few-participants'
  | 'duplicate-participants'
  | 'infeasible';

/** Source of randomness. Returns a float in [0, 1). `Math.random` satisfies it. */
export type Rng = () => number;

export const MINIMUM_PARTICIPANTS = 3;

/**
 * In-place Fisher-Yates. The previous implementation used
 * `sort(() => Math.random() - 0.5)`, which is not a uniform shuffle — it skews
 * the draw toward the input order.
 */
function shuffle<T>(items: T[], rng: Rng): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Exhaustive backtracking search over receivers.
 *
 * Because it is exhaustive, a `null` here means no valid assignment exists —
 * not that we were unlucky. The old driver retried this 1000 times, which could
 * only ever reach the same conclusion 1000× slower.
 */
function search(
  remainingGivers: ParticipantId[],
  assigned: Pairing[],
  availableReceivers: Set<ParticipantId>,
  input: DrawInput,
  rng: Rng,
  avoidHistory: boolean,
): Pairing[] | null {
  if (remainingGivers.length === 0) return assigned;

  const giverId = remainingGivers[0];
  const excluded = input.exclusions.get(giverId);
  const recent = input.history.get(giverId);

  let candidates = Array.from(availableReceivers).filter(
    (id) => id !== giverId && !excluded?.has(id),
  );
  if (avoidHistory) {
    candidates = candidates.filter((id) => !recent?.has(id));
  }
  if (candidates.length === 0) return null;

  for (const recipientId of shuffle(candidates, rng)) {
    availableReceivers.delete(recipientId);
    assigned.push({ userId: giverId, assignedToId: recipientId });

    const result = search(
      remainingGivers.slice(1),
      assigned,
      availableReceivers,
      input,
      rng,
      avoidHistory,
    );
    if (result) return result;

    // Backtrack.
    assigned.pop();
    availableReceivers.add(recipientId);
  }

  return null;
}

/**
 * Draw a complete set of pairings, or explain why one is impossible.
 *
 * Guarantees on `ok: true`: every participant gives exactly once, receives
 * exactly once, gives to someone other than themselves, and never to someone in
 * their exclusion set.
 */
export function drawAssignments(
  input: DrawInput,
  rng: Rng = Math.random,
): DrawResult {
  const { participantIds } = input;

  if (new Set(participantIds).size !== participantIds.length) {
    return {
      ok: false,
      reason: 'duplicate-participants',
      message: 'The same person appears more than once in this event.',
    };
  }

  if (participantIds.length < MINIMUM_PARTICIPANTS) {
    return {
      ok: false,
      reason: 'too-few-participants',
      message: `Need at least ${MINIMUM_PARTICIPANTS} participants for Secret Santa`,
    };
  }

  // Two passes. The first treats "drew them recently" as a hard constraint, so
  // if any repeat-free assignment exists it is found. Only when none exists do
  // we relax it — a per-candidate preference alone is greedy and leaves the
  // last giver in the order stuck with a repeat that was avoidable.
  const pairings =
    search(
      shuffle([...participantIds], rng),
      [],
      new Set(participantIds),
      input,
      rng,
      true,
    ) ??
    search(
      shuffle([...participantIds], rng),
      [],
      new Set(participantIds),
      input,
      rng,
      false,
    );

  if (!pairings) {
    return {
      ok: false,
      reason: 'infeasible',
      message:
        'Could not create valid assignments with current exclusions. Please review exclusion pairs.',
    };
  }

  return { ok: true, pairings };
}

/**
 * Build a symmetric exclusion map from one-directional rows.
 *
 * The schema stores exclusions as a self-relation whose two sides are written
 * separately, and only one side is ever read back. Closing the map here means
 * the draw cannot be corrupted by a half-written pair.
 */
export function toExclusionMap(
  rows: Array<{
    id: ParticipantId;
    excludes: Array<{ id: ParticipantId }>;
  }>,
): Map<ParticipantId, Set<ParticipantId>> {
  const map = new Map<ParticipantId, Set<ParticipantId>>();
  const add = (a: ParticipantId, b: ParticipantId) => {
    const existing = map.get(a);
    if (existing) existing.add(b);
    else map.set(a, new Set([b]));
  };

  for (const row of rows) {
    for (const excluded of row.excludes) {
      add(row.id, excluded.id);
      add(excluded.id, row.id);
    }
  }
  return map;
}

/** Build the soft-constraint map from previous participation rows. */
export function toHistoryMap(
  rows: Array<{ userId: ParticipantId; assignedToId: ParticipantId | null }>,
): Map<ParticipantId, Set<ParticipantId>> {
  const map = new Map<ParticipantId, Set<ParticipantId>>();
  for (const { userId, assignedToId } of rows) {
    if (!assignedToId) continue;
    const existing = map.get(userId);
    if (existing) existing.add(assignedToId);
    else map.set(userId, new Set([assignedToId]));
  }
  return map;
}
