/**
 * The Season — which year is in play, and every window measured against it.
 *
 * "This year" was being re-derived in five places with three different answers:
 * the gift year window in `db/visibility`, the event partition in
 * `secret-santa/events`, the draw's history cutoff, an inline window on the home
 * page, and a hand-rolled copy of the partition in the admin event list. Each
 * one had its own idea of where a year starts.
 *
 * Every window takes `now` as a parameter and is computed per call, so a server
 * process alive across New Year cannot keep serving the old Season and the
 * windows can be asserted directly in tests.
 *
 * Client-safe: no Prisma, no `next/*`. The date filters are plain objects, which
 * are structurally what Prisma's `DateTimeFilter` wants.
 */

/** A half-open instant range: `gte <= t < lt`. */
export type Window = { gte: Date; lt: Date };

/** An open-ended range, used where only the lower bound matters. */
export type OpenWindow = { gte: Date };

/** UTC midnight on Jan 1 of `year`. Every database window starts here. */
function januaryFirst(year: number): Date {
  return new Date(`${year}-01-01`);
}

export type Season = {
  /** The calendar year currently in play. */
  year: number;
  /**
   * Gifts considered "current": this year and the two before it. Wide on
   * purpose — a gift added last December is still a fair suggestion in January.
   */
  giftWindow: Window;
  /** Secret Santa Events belonging to this Season. */
  eventWindow: Window;
  /**
   * How far back the draw looks to avoid repeating last year's pairing. Only
   * the previous year and this one count as recent.
   */
  drawHistoryWindow: OpenWindow;
};

export function currentSeason(now: Date = new Date()): Season {
  const year = now.getFullYear();
  return {
    year,
    giftWindow: { gte: januaryFirst(year - 2), lt: januaryFirst(year + 1) },
    eventWindow: { gte: januaryFirst(year), lt: januaryFirst(year + 1) },
    drawHistoryWindow: { gte: januaryFirst(year - 1) },
  };
}

/** Anything the app groups into a Season by when it was created. */
export type Dated = { createdAt: Date | string };

export function yearOf(dated: Dated): number {
  return new Date(dated.createdAt).getFullYear();
}

/**
 * Split by Season into "this year" and "past", newest first.
 *
 * Both the Secret Santa page and the admin event list render this split. The
 * admin copy used to be written out by hand.
 */
export function partitionBySeason<T extends Dated>(
  items: readonly T[],
  now: Date = new Date(),
): { current: T[]; past: T[]; year: number } {
  const { year } = currentSeason(now);
  const sorted = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return {
    year,
    current: sorted.filter((item) => yearOf(item) === year),
    past: sorted.filter((item) => yearOf(item) < year),
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
