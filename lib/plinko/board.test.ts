import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  advanceBall,
  type Board,
  layoutBoard,
  MAX_ROWS,
  MIN_ROWS,
  payoutsFor,
  RISKS,
  type Risk,
  type Rng,
  slotAt,
  spawnBall,
} from './board.ts';

/** Deterministic generator, so a failing drop can be reproduced exactly. */
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

const WIDTH = 848;
const STEP = 1 / 240;

type Drop = { slot: number; seconds: number };

/** Drops one ball down the middle and reports where and when it landed. */
function drop(board: Board, rng: Rng): Drop {
  const ball = spawnBall(board, board.width / 2, rng);
  for (let ticks = 0; ticks < 6000; ticks++) {
    const { slot } = advanceBall(ball, board, STEP, rng);
    assert.ok(
      ball.x > board.slotLeft - 1 &&
        ball.x < board.slotLeft + board.slots * board.slotWidth + 1,
      `escaped the rails at x=${ball.x}`,
    );
    if (slot !== null) return { slot, seconds: ticks * STEP };
  }
  throw new Error('ball never landed');
}

function dropMany(risk: Risk, rows: number, count: number) {
  const board = layoutBoard(WIDTH, rows);
  const rng = seededRng(0xc0ffee + rows);
  const counts = new Array<number>(board.slots).fill(0);
  let seconds = 0;
  for (let i = 0; i < count; i++) {
    const result = drop(board, rng);
    counts[result.slot] = (counts[result.slot] ?? 0) + 1;
    seconds += result.seconds;
  }
  const probability = counts.map((c) => c / count);
  const mean = probability.reduce((s, p, i) => s + p * i, 0);
  return {
    board,
    counts,
    probability,
    mean,
    seconds: seconds / count,
    deviation: Math.sqrt(
      probability.reduce((s, p, i) => s + p * (i - mean) ** 2, 0),
    ),
    /** What the payout table returns per unit staked, at this distribution. */
    rtp: probability.reduce(
      (s, p, i) => s + p * (payoutsFor(risk, rows)[i] ?? 0),
      0,
    ),
  };
}

/** P(k heads in n fair flips) — the distribution the payouts are priced for. */
function binomial(n: number): number[] {
  const out: number[] = [];
  let c = 1;
  for (let k = 0; k <= n; k++) {
    out.push(c / 2 ** n);
    c = (c * (n - k)) / (k + 1);
  }
  return out;
}

describe('layoutBoard', () => {
  it('gives every row one more peg than the last, starting at three', () => {
    const board = layoutBoard(WIDTH, 12);
    assert.deepEqual(
      board.pegRows.map((r) => r.length),
      [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    );
  });

  it('lines the slots up with the gaps in the last peg row', () => {
    const board = layoutBoard(WIDTH, 12);
    const lastRow = board.pegRows.at(-1) ?? [];
    assert.equal(board.slots, lastRow.length - 1);
    assert.equal(Math.round(board.slotLeft), Math.round(lastRow[0]?.x ?? -1));
    assert.equal(
      Math.round(board.slotLeft + board.slots * board.slotWidth),
      Math.round(lastRow.at(-1)?.x ?? -1),
    );
  });

  it('has a payout table for every offered row count', () => {
    for (const risk of RISKS) {
      for (let rows = MIN_ROWS; rows <= MAX_ROWS; rows++) {
        assert.equal(
          payoutsFor(risk, rows).length,
          rows + 1,
          `${risk}/${rows}`,
        );
      }
    }
  });
});

describe('slotAt', () => {
  it('clamps to the board rather than reading off the end of the table', () => {
    const board = layoutBoard(WIDTH, 12);
    assert.equal(slotAt(board, -1000), 0);
    assert.equal(slotAt(board, 1e6), board.slots - 1);
  });
});

describe('a falling ornament', () => {
  it('always lands, inside the rails, in about a second', () => {
    for (let rows = MIN_ROWS; rows <= MAX_ROWS; rows++) {
      const { seconds } = dropMany('medium', rows, 60);
      assert.ok(
        seconds > 0.8 && seconds < 2.5,
        `${rows} rows: a drop takes ${seconds.toFixed(2)}s`,
      );
    }
  });

  it('lands binomially, which is what the payouts are priced against', () => {
    // Asserted on the distribution rather than on measured return, because
    // return is dominated by rare jackpots — one 1000x hit in 800 drops moves
    // it by 1.25, which makes for a flaky test. The distribution is the part
    // the physics controls; the return follows from it and the fixed tables.
    for (const rows of [MIN_ROWS, 12, MAX_ROWS]) {
      const { probability, mean, deviation } = dropMany('medium', rows, 800);
      const ideal = binomial(rows);

      const drift =
        0.5 *
        probability.reduce((s, p, i) => s + Math.abs(p - (ideal[i] ?? 0)), 0);
      assert.ok(
        drift < 0.16,
        `${rows} rows: shape drifted ${drift.toFixed(3)}`,
      );
      assert.ok(
        Math.abs(mean - rows / 2) < 0.5,
        `${rows} rows: board leans, mean slot ${mean.toFixed(2)}`,
      );

      const spread = deviation / (Math.sqrt(rows) / 2);
      assert.ok(
        spread > 0.8 && spread < 1.25,
        `${rows} rows: spread is ${spread.toFixed(2)}x binomial`,
      );
    }
  });

  it('never returns more than it takes, at any risk', () => {
    // Wide band on purpose — see the note above. This catches a board that
    // pays multiples of its stake, not small drift.
    for (const risk of RISKS) {
      for (const rows of [MIN_ROWS, 12, MAX_ROWS]) {
        const { rtp } = dropMany(risk, rows, 800);
        assert.ok(rtp < 1.5, `${risk}/${rows} returns ${rtp.toFixed(2)}x`);
      }
    }
  });

  it('is reproducible under a seeded generator', () => {
    const board = layoutBoard(WIDTH, 12);
    const once = drop(board, seededRng(42));
    const again = drop(board, seededRng(42));
    assert.deepEqual(once, again);
  });
});
