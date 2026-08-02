/**
 * The Plinko board — geometry, payouts and the fall of a single ornament.
 *
 * Deliberately free of React, canvas and `next/*`: the caller supplies the
 * randomness, so a seeded generator reproduces a drop exactly. That is what
 * lets `board.test.ts` assert the thing that actually matters and cannot be
 * seen by eye — that ornaments land in a *binomial* distribution.
 *
 * Why binomial matters: `PAYOUTS` is priced against it. If the landing spread
 * drifts wider, the edge slots (up to 1000x) come up far more often than they
 * are priced for and the board pays out several times its stake on average.
 * Two rewrites of this file shipped exactly that bug, so the invariant is a
 * test, not a comment.
 *
 * The physics that keeps it binomial:
 *   - A ball is only ever falling toward one peg row, so it can neither
 *     re-collide with the peg it just left nor be deflected twice by one row.
 *   - Each peg deflects it by half a column, and the sideways speed is solved
 *     from the hop's flight time — so BOUNCE changes how the carom *looks*
 *     without changing where anything lands.
 *   - Which way it leaves a peg is a fair coin. Deriving that from the contact
 *     point is knife-edge: land a hair inside and the ball zigzags to dead
 *     centre, a hair outside and it runs to the rail.
 */

export type Rng = () => number;

export type Risk = 'low' | 'medium' | 'high';

export const RISKS: readonly Risk[] = ['low', 'medium', 'high'];

/** Inclusive bounds for the row count. Every value has a payout row below. */
export const MIN_ROWS = 8;
export const MAX_ROWS = 16;

/**
 * Slot multipliers, indexed by risk then row count. Edges pay, the middle
 * bleeds. A row of N pegs deep has N+1 slots.
 */
export const PAYOUTS: Record<Risk, Record<number, readonly number[]>> = {
  low: {
    8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
    9: [5.6, 2, 1.6, 1, 0.7, 0.7, 1, 1.6, 2, 5.6],
    10: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
    11: [8.4, 3, 1.9, 1.3, 1, 0.7, 0.7, 1, 1.3, 1.9, 3, 8.4],
    12: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
    13: [8.1, 4, 3, 1.9, 1.2, 0.9, 0.7, 0.7, 0.9, 1.2, 1.9, 3, 4, 8.1],
    14: [7.1, 4, 1.9, 1.4, 1.3, 1.1, 1, 0.5, 1, 1.1, 1.3, 1.4, 1.9, 4, 7.1],
    15: [15, 8, 3, 2, 1.5, 1.1, 1, 0.7, 0.7, 1, 1.1, 1.5, 2, 3, 8, 15],
    16: [16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
  },
  medium: {
    8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
    9: [18, 4, 1.7, 0.9, 0.5, 0.5, 0.9, 1.7, 4, 18],
    10: [22, 5, 2, 1.4, 0.6, 0.4, 0.6, 1.4, 2, 5, 22],
    11: [24, 6, 3, 1.8, 0.7, 0.5, 0.5, 0.7, 1.8, 3, 6, 24],
    12: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
    13: [43, 13, 6, 3, 1.3, 0.7, 0.4, 0.4, 0.7, 1.3, 3, 6, 13, 43],
    14: [58, 15, 7, 4, 1.9, 1, 0.5, 0.2, 0.5, 1, 1.9, 4, 7, 15, 58],
    15: [88, 18, 11, 5, 3, 1.3, 0.5, 0.3, 0.3, 0.5, 1.3, 3, 5, 11, 18, 88],
    16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
  },
  high: {
    8: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
    9: [43, 7, 2, 0.6, 0.2, 0.2, 0.6, 2, 7, 43],
    10: [76, 10, 3, 0.9, 0.3, 0.2, 0.3, 0.9, 3, 10, 76],
    11: [120, 14, 5.2, 1.4, 0.4, 0.2, 0.2, 0.4, 1.4, 5.2, 14, 120],
    12: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
    13: [260, 37, 11, 4, 1, 0.2, 0.2, 0.2, 0.2, 1, 4, 11, 37, 260],
    14: [420, 56, 18, 5, 1.9, 0.3, 0.2, 0.2, 0.2, 0.3, 1.9, 5, 18, 56, 420],
    15: [620, 83, 27, 8, 3, 0.5, 0.2, 0.2, 0.2, 0.2, 0.5, 3, 8, 27, 83, 620],
    16: [
      1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000,
    ],
  },
};

export function payoutsFor(risk: Risk, rows: number): readonly number[] {
  const table = PAYOUTS[risk][rows];
  if (!table) throw new Error(`no payout table for ${risk}/${rows} rows`);
  return table;
}

/**
 * Fitted constants. `DEFLECT` is the one that decides the odds: landing spread
 * scales with it roughly one-for-one, and past about 1.8 the ball starts riding
 * the lattice and every drop runs to an edge. `BOUNCE` and `GRAVITY` are free —
 * the first is cosmetic, the second only sets the pace.
 */
const GRAVITY = 12000;
const RAIL_RESTITUTION = 0.35;
const DEFLECT = 0.95;
const SPREAD = 0.6;
const BOUNCE = 0.55;

export type Peg = { readonly x: number; readonly y: number };

export type Board = {
  readonly width: number;
  readonly height: number;
  readonly rows: number;
  readonly gap: number;
  readonly rowGap: number;
  readonly topPad: number;
  readonly lastRowY: number;
  readonly pegRows: readonly (readonly Peg[])[];
  readonly pegs: readonly Peg[];
  readonly slots: number;
  readonly slotWidth: number;
  readonly slotLeft: number;
  readonly slotTop: number;
  readonly slotHeight: number;
  readonly ballRadius: number;
  readonly pegRadius: number;
};

/**
 * Peg triangle plus the slots beneath it, sized to fill `width`. Row r holds
 * r+3 pegs, so the last row's gaps line up exactly with the slots.
 */
export function layoutBoard(width: number, rows: number): Board {
  const gap = width / (rows + 3.2);
  const rowGap = gap * 0.92;
  const topPad = gap * 1.9;
  const slotHeight = gap * 1.5;
  const lastRowY = topPad + (rows - 1) * rowGap;

  const pegRows: Peg[][] = [];
  const pegs: Peg[] = [];
  for (let r = 0; r < rows; r++) {
    const count = r + 3;
    const y = topPad + r * rowGap;
    const row: Peg[] = [];
    for (let c = 0; c < count; c++) {
      const peg = { x: width / 2 + (c - (count - 1) / 2) * gap, y };
      row.push(peg);
      pegs.push(peg);
    }
    pegRows.push(row);
  }

  const slots = rows + 1;
  return {
    width,
    height: lastRowY + gap * 1.5 + slotHeight,
    rows,
    gap,
    rowGap,
    topPad,
    lastRowY,
    pegRows,
    pegs,
    slots,
    slotWidth: gap,
    slotLeft: width / 2 - (slots * gap) / 2,
    slotTop: lastRowY + gap,
    slotHeight,
    ballRadius: gap * 0.22,
    pegRadius: gap * 0.135,
  };
}

export type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Which peg row it is falling toward. */
  row: number;
  rot: number;
  spin: number;
  landed: boolean;
};

export function spawnBall(board: Board, fromX: number, rng: Rng): Ball {
  const limit = board.gap;
  return {
    x: fromX + (rng() - 0.5) * limit * 0.35,
    y: board.gap * 0.5,
    vx: (rng() - 0.5) * 30,
    vy: 0,
    row: 0,
    rot: (rng() - 0.5) * 0.6,
    spin: 0,
    landed: false,
  };
}

export type Advance = {
  /** The peg struck this step, for the ping and the flash. */
  pegHit: Peg | null;
  /** The slot it came to rest in, once. */
  slot: number | null;
};

const NOTHING: Advance = { pegHit: null, slot: null };

/**
 * Move one ball forward by `dt` seconds. Mutates `ball` — this runs a few
 * times per frame per ball, and allocating a new one each time showed up.
 */
export function advanceBall(
  ball: Ball,
  board: Board,
  dt: number,
  rng: Rng,
): Advance {
  if (ball.landed) return NOTHING;

  const g = GRAVITY * (board.gap / 44);
  ball.rot += ball.spin * dt;
  ball.spin *= Math.max(0, 1 - 1.1 * dt);
  ball.vy += g * dt;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  let pegHit: Peg | null = null;

  // Past the row it was aiming at without touching it: aim at the next one.
  if (
    ball.row < board.pegRows.length &&
    ball.y > board.topPad + ball.row * board.rowGap + board.rowGap * 0.5
  ) {
    ball.row++;
  }

  const row = board.pegRows[ball.row];
  if (row) {
    const reach = board.ballRadius + board.pegRadius;
    for (const peg of row) {
      const dx = ball.x - peg.x;
      const dy = ball.y - peg.y;
      if (dx * dx + dy * dy > reach * reach) continue;
      if (ball.vy <= 0) continue;

      // Carom off the peg's shoulder. Resolving along the contact normal
      // instead lets the ball grind across the peg face, and that grind nudges
      // it whichever way it was already going — enough bias to send every ball
      // to an edge.
      const side = rng() < 0.5 ? -1 : 1;
      const speed = Math.max(ball.vy, 60);
      ball.x = peg.x + side * reach;
      ball.y = peg.y;

      // Kick up for a real hop, then solve the sideways speed that still puts
      // it on the next row's peg line: rowGap = vy·t + ½g·t² → t, vx = travel/t.
      ball.vy = -speed * BOUNCE;
      const t =
        (-ball.vy + Math.sqrt(ball.vy * ball.vy + 2 * g * board.rowGap)) / g;
      const travel =
        side *
        (DEFLECT * 0.5 * board.gap - reach) *
        (1 + (rng() - 0.5) * SPREAD);
      ball.vx = travel / t;
      ball.spin = side * (1.8 + rng() * 3.4);
      ball.row++;
      pegHit = peg;
      break;
    }
  }

  // Angled rails hugging the outermost peg of each row. Without them balls slip
  // past the triangle and pile into the jackpot slots.
  const depth = Math.max(0, Math.min(ball.y, board.lastRowY) - board.topPad);
  const rail = board.gap * (1 + (0.5 * depth) / board.rowGap);
  const lo = board.width / 2 - rail;
  const hi = board.width / 2 + rail;
  if (ball.x < lo) {
    ball.x = lo;
    ball.vx = Math.abs(ball.vx) * RAIL_RESTITUTION;
  }
  if (ball.x > hi) {
    ball.x = hi;
    ball.vx = -Math.abs(ball.vx) * RAIL_RESTITUTION;
  }

  if (ball.y > board.slotTop) {
    ball.landed = true;
    return { pegHit, slot: slotAt(board, ball.x) };
  }
  return pegHit ? { pegHit, slot: null } : NOTHING;
}

/** Which slot an x sits over, clamped to the board. */
export function slotAt(board: Board, x: number): number {
  const i = Math.floor((x - board.slotLeft) / board.slotWidth);
  return Math.max(0, Math.min(board.slots - 1, i));
}
