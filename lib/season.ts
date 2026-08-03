/**
 * The Season — which year is in play, and every window measured against it.
 *
 * "This year" was being re-derived in five places with three different answers:
 * the gift year window in `db/visibility`, the event partition in
 * `secret-santa/events`, the draw's history cutoff, an inline window on the home
 * page, and a hand-rolled copy of the partition in the admin event list. Each
 * one had its own idea of where a year starts.
 *
 * Two distinct years live here and must not be conflated. `year` is the
 * calendar's, and drives how stale a gift may be. `occasionYear` is the
 * Christmas an [Exchange] is held *for*, which the row carries in a column
 * because it is not derivable from the calendar: an exchange drawn on
 * January 2nd belongs to the year before. See `CONTEXT.md` on Occasion.
 *
 * Every window takes `now` as a parameter and is computed per call, so a server
 * process alive across New Year cannot keep serving the old Season and the
 * windows can be asserted directly in tests.
 *
 * Client-safe: no Prisma, no `next/*`. The filters are plain objects, which are
 * structurally what Prisma's `where` wants.
 */

/** A half-open instant range: `gte <= t < lt`. */
export type Window = { gte: Date; lt: Date };

/** UTC midnight on Jan 1 of `year`. Every database window starts here. */
function januaryFirst(year: number): Date {
  return new Date(`${year}-01-01`);
}

/**
 * The month an Occasion year turns over, zero-indexed. Christmas is the only
 * Occasion, so January, February and March still belong to the Christmas just
 * gone; from April, whoever opens an Exchange means the next one.
 */
const OCCASION_ROLLOVER_MONTH = 3;

export type Season = {
  /** The calendar year currently in play. */
  year: number;
  /**
   * The Occasion an Exchange opened now is held for. Trails `year` through the
   * first quarter, so a draw run on January 2nd files under the Christmas it
   * is actually for.
   */
  occasionYear: number;
  /**
   * Gifts considered "current": this year and the two before it. Wide on
   * purpose — a gift added last December is still a fair suggestion in January.
   */
  giftWindow: Window;
};

export function currentSeason(now: Date = new Date()): Season {
  const year = now.getFullYear();
  return {
    year,
    occasionYear: now.getMonth() < OCCASION_ROLLOVER_MONTH ? year - 1 : year,
    giftWindow: { gte: januaryFirst(year - 2), lt: januaryFirst(year + 1) },
  };
}

/** An Exchange, as much of one as deciding its Occasion needs. */
export type Exchange = { year: number | null; createdAt: Date | string };

/**
 * Which Occasion an Exchange is held for.
 *
 * A null `year` reads as the year it was opened in, which is the answer the
 * backfill would have written and the only one the row carries.
 */
export function occasionYearOf(exchange: Exchange): number {
  return exchange.year ?? new Date(exchange.createdAt).getFullYear();
}

/**
 * Exchanges held for the Occasion in play, as a Prisma `where`.
 *
 * The `createdAt` arm is `occasionYearOf`'s fallback expressed in SQL: rows
 * carrying a `year` are matched on it, and only rows without one are judged by
 * when they were opened.
 */
export function heldForCurrentOccasion(now: Date = new Date()) {
  const { occasionYear } = currentSeason(now);
  return {
    OR: [
      { year: occasionYear },
      {
        year: null,
        createdAt: {
          gte: januaryFirst(occasionYear),
          lt: januaryFirst(occasionYear + 1),
        },
      },
    ],
  };
}

/**
 * Exchanges recent enough that the Draw must not repeat their pairings — the
 * Occasion in play and the one before it.
 */
export function withinDrawHistory(now: Date = new Date()) {
  const { occasionYear } = currentSeason(now);
  return {
    OR: [
      { year: { gte: occasionYear - 1 } },
      { year: null, createdAt: { gte: januaryFirst(occasionYear - 1) } },
    ],
  };
}

/**
 * Split by Occasion into "the one in play" and "past", newest first.
 *
 * Both the Secret Santa page and the admin event list render this split. The
 * admin copy used to be written out by hand.
 */
export function partitionBySeason<T extends Exchange>(
  items: readonly T[],
  now: Date = new Date(),
): { current: T[]; past: T[]; year: number } {
  const { occasionYear } = currentSeason(now);
  const sorted = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  // Anything not held for the Occasion in play is past, rather than strictly
  // older than it, so the two halves always account for every item.
  return {
    year: occasionYear,
    current: sorted.filter((item) => occasionYearOf(item) === occasionYear),
    past: sorted.filter((item) => occasionYearOf(item) !== occasionYear),
  };
}

/**
 * The next December 25th, in local time — this one drives a countdown in the
 * sidebar, so it follows the viewer's clock rather than UTC.
 */
export function nextChristmas(now: Date = new Date()): Date {
  const thisChristmas = new Date(now.getFullYear(), 11, 25);
  return now > thisChristmas
    ? new Date(now.getFullYear() + 1, 11, 25)
    : thisChristmas;
}

export function daysUntilChristmas(now: Date = new Date()): number {
  const millis = nextChristmas(now).getTime() - now.getTime();
  return Math.floor(millis / (1000 * 60 * 60 * 24));
}

/**
 * How far the year has run from one Christmas to the next, 0–100.
 *
 * Measured across the whole cycle rather than from December 1st, so the bar it
 * drives means the same thing in August as it does on the 24th.
 */
export function christmasProgress(now: Date = new Date()): number {
  const next = nextChristmas(now);
  const previous = new Date(next.getFullYear() - 1, 11, 25);
  const span = next.getTime() - previous.getTime();
  return Math.round(((now.getTime() - previous.getTime()) / span) * 100);
}
