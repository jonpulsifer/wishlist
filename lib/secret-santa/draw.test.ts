import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  type DrawInput,
  drawAssignments,
  MINIMUM_PARTICIPANTS,
  type Pairing,
  type Rng,
  toExclusionMap,
  toHistoryMap,
} from './draw.ts';

/** Deterministic generator, so a failing draw can be reproduced exactly. */
function seededRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    // xorshift32
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 0x100000000;
  };
}

function input(
  participantIds: string[],
  overrides: Partial<DrawInput> = {},
): DrawInput {
  return {
    participantIds,
    exclusions: new Map(),
    history: new Map(),
    ...overrides,
  };
}

function assertIsDerangement(pairings: Pairing[], participantIds: string[]) {
  assert.equal(pairings.length, participantIds.length, 'everyone gives once');

  const givers = pairings.map((p) => p.userId);
  const receivers = pairings.map((p) => p.assignedToId);

  assert.deepEqual(
    [...givers].sort(),
    [...participantIds].sort(),
    'every participant gives exactly once',
  );
  assert.deepEqual(
    [...receivers].sort(),
    [...participantIds].sort(),
    'every participant receives exactly once',
  );
  for (const { userId, assignedToId } of pairings) {
    assert.notEqual(userId, assignedToId, 'nobody draws themselves');
  }
}

describe('drawAssignments', () => {
  it('produces a derangement for a simple group', () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const result = drawAssignments(input(ids), seededRng(1));

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assertIsDerangement(result.pairings, ids);
  });

  it('produces a derangement at every size from the minimum up to 40', () => {
    for (let n = MINIMUM_PARTICIPANTS; n <= 40; n++) {
      const ids = Array.from({ length: n }, (_, i) => `p${i}`);
      const result = drawAssignments(input(ids), seededRng(n + 1));

      assert.equal(result.ok, true, `n=${n} should succeed`);
      if (!result.ok) continue;
      assertIsDerangement(result.pairings, ids);
    }
  });

  it('never pairs people who exclude each other', () => {
    const ids = ['a', 'b', 'c', 'd'];
    const exclusions = new Map([
      ['a', new Set(['b'])],
      ['b', new Set(['a'])],
    ]);

    // Many seeds, because a single lucky draw proves nothing.
    for (let seed = 1; seed <= 200; seed++) {
      const result = drawAssignments(
        input(ids, { exclusions }),
        seededRng(seed),
      );
      assert.equal(result.ok, true);
      if (!result.ok) continue;

      assertIsDerangement(result.pairings, ids);
      for (const { userId, assignedToId } of result.pairings) {
        assert.ok(
          !exclusions.get(userId)?.has(assignedToId),
          `seed ${seed}: ${userId} must not draw ${assignedToId}`,
        );
      }
    }
  });

  it('reports infeasible rather than looping when exclusions admit no solution', () => {
    // Three people, and everyone is excluded from everyone: no derangement exists.
    const ids = ['a', 'b', 'c'];
    const exclusions = new Map([
      ['a', new Set(['b', 'c'])],
      ['b', new Set(['a', 'c'])],
      ['c', new Set(['a', 'b'])],
    ]);

    const result = drawAssignments(input(ids, { exclusions }), seededRng(7));

    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'infeasible');
  });

  it('still finds the one legal assignment when exclusions are nearly total', () => {
    // a->b, b->c, c->a is the only derangement left open.
    const ids = ['a', 'b', 'c'];
    const exclusions = new Map([
      ['a', new Set(['c'])],
      ['b', new Set(['a'])],
      ['c', new Set(['b'])],
    ]);

    const result = drawAssignments(input(ids, { exclusions }), seededRng(3));

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(
      result.pairings.sort((x, y) => x.userId.localeCompare(y.userId)),
      [
        { userId: 'a', assignedToId: 'b' },
        { userId: 'b', assignedToId: 'c' },
        { userId: 'c', assignedToId: 'a' },
      ],
    );
  });

  it('avoids last year’s pairing when an alternative exists', () => {
    const ids = ['a', 'b', 'c', 'd'];
    const history = new Map([['a', new Set(['b'])]]);

    let repeats = 0;
    for (let seed = 1; seed <= 200; seed++) {
      const result = drawAssignments(input(ids, { history }), seededRng(seed));
      assert.equal(result.ok, true);
      if (!result.ok) continue;
      if (result.pairings.find((p) => p.userId === 'a')?.assignedToId === 'b') {
        repeats++;
      }
    }

    assert.equal(repeats, 0, 'a should never redraw b while c or d are free');
  });

  it('treats history as a preference, not a constraint', () => {
    // a has had everyone recently; a draw must still be possible.
    const ids = ['a', 'b', 'c'];
    const history = new Map([['a', new Set(['b', 'c'])]]);

    const result = drawAssignments(input(ids, { history }), seededRng(11));
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assertIsDerangement(result.pairings, ids);
  });

  it('rejects a group below the minimum', () => {
    const result = drawAssignments(input(['a', 'b']), seededRng(1));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'too-few-participants');
  });

  it('rejects duplicate participants', () => {
    const result = drawAssignments(input(['a', 'b', 'a']), seededRng(1));
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'duplicate-participants');
  });

  it('is reproducible for a given seed and varies across seeds', () => {
    const ids = ['a', 'b', 'c', 'd', 'e', 'f'];

    const first = drawAssignments(input(ids), seededRng(42));
    const again = drawAssignments(input(ids), seededRng(42));
    assert.deepEqual(first, again, 'same seed, same draw');

    const seen = new Set<string>();
    for (let seed = 1; seed <= 50; seed++) {
      const result = drawAssignments(input(ids), seededRng(seed));
      if (result.ok) seen.add(JSON.stringify(result.pairings));
    }
    assert.ok(seen.size > 1, 'different seeds should not all give one draw');
  });

  it('does not mutate its input', () => {
    const ids = ['a', 'b', 'c', 'd'];
    const copy = [...ids];
    drawAssignments(input(ids), seededRng(5));
    assert.deepEqual(ids, copy);
  });
});

describe('toExclusionMap', () => {
  it('closes a one-directional row into a symmetric map', () => {
    // The schema writes both sides, but only one is ever read back; a
    // half-written pair must not let the draw match the excluded couple.
    const map = toExclusionMap([
      { id: 'a', excludes: [{ id: 'b' }] },
      { id: 'b', excludes: [] },
    ]);

    assert.ok(map.get('a')?.has('b'));
    assert.ok(map.get('b')?.has('a'), 'the reverse direction is inferred');
  });

  it('honours a half-written pair during a draw', () => {
    // Four people, so excluding a<->b still leaves a solution: with three, both
    // a and b would need c and no derangement exists.
    const ids = ['a', 'b', 'c', 'd'];
    const exclusions = toExclusionMap([
      { id: 'a', excludes: [{ id: 'b' }] },
      { id: 'b', excludes: [] },
      { id: 'c', excludes: [] },
      { id: 'd', excludes: [] },
    ]);

    for (let seed = 1; seed <= 100; seed++) {
      const result = drawAssignments(
        input(ids, { exclusions }),
        seededRng(seed),
      );
      assert.equal(result.ok, true);
      if (!result.ok) continue;
      for (const { userId, assignedToId } of result.pairings) {
        assert.ok(
          !(userId === 'b' && assignedToId === 'a'),
          'b must not draw a even though only a recorded the exclusion',
        );
      }
    }
  });
});

describe('toHistoryMap', () => {
  it('skips rows with no assignment and groups by giver', () => {
    const map = toHistoryMap([
      { userId: 'a', assignedToId: 'b' },
      { userId: 'a', assignedToId: 'c' },
      { userId: 'b', assignedToId: null },
    ]);

    assert.deepEqual([...(map.get('a') ?? [])].sort(), ['b', 'c']);
    assert.equal(map.has('b'), false);
  });
});
