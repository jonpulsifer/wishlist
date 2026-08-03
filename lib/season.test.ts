import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  christmasProgress,
  currentSeason,
  daysUntilChristmas,
  heldForCurrentOccasion,
  nextChristmas,
  occasionYearOf,
  partitionBySeason,
  withinDrawHistory,
} from './season.ts';

const MID_SEASON = new Date('2026-08-01T12:00:00Z');
/** The January that files an exchange under the wrong year if `createdAt` decides. */
const EARLY_JANUARY = new Date('2027-01-02T12:00:00Z');

describe('currentSeason', () => {
  it('names the year in play', () => {
    assert.equal(currentSeason(MID_SEASON).year, 2026);
  });

  it('spans this year and the two before it for gifts', () => {
    const { giftWindow } = currentSeason(MID_SEASON);
    assert.deepEqual(giftWindow.gte, new Date('2024-01-01'));
    assert.deepEqual(giftWindow.lt, new Date('2027-01-01'));
  });

  it('is evaluated per call, not once at import', () => {
    // A module-level constant meant a process alive across New Year kept
    // serving the previous Season.
    const before = currentSeason(new Date('2026-12-31T12:00:00Z'));
    const after = currentSeason(new Date('2027-01-01T12:00:00Z'));
    assert.equal(before.year, 2026);
    assert.equal(after.year, 2027);
    assert.notDeepEqual(before.giftWindow.gte, after.giftWindow.gte);
  });

  it('keeps the gift window half-open and ordered', () => {
    const { giftWindow } = currentSeason(MID_SEASON);
    assert.ok(giftWindow.gte < giftWindow.lt);
  });
});

describe('occasionYear', () => {
  it('tracks the calendar year from April onward', () => {
    for (const month of ['04', '08', '12']) {
      const now = new Date(`2026-${month}-15T12:00:00Z`);
      assert.equal(currentSeason(now).occasionYear, 2026);
    }
  });

  it('stays on last Christmas through the first quarter', () => {
    // The bug: an exchange for Christmas 2026, opened on January 2nd 2027,
    // is for 2026 and must not file itself under 2027.
    for (const month of ['01', '02', '03']) {
      const now = new Date(`2027-${month}-15T12:00:00Z`);
      assert.equal(currentSeason(now).occasionYear, 2026);
    }
    assert.equal(currentSeason(EARLY_JANUARY).occasionYear, 2026);
  });

  it('turns over on April 1st, not New Year', () => {
    assert.equal(
      currentSeason(new Date('2027-03-31T23:59:59Z')).occasionYear,
      2026,
    );
    assert.equal(
      currentSeason(new Date('2027-04-01T00:00:00Z')).occasionYear,
      2027,
    );
  });
});

describe('occasionYearOf', () => {
  it('reads the column when the row carries one', () => {
    // Opened in January, held for the Christmas before it.
    const exchange = {
      year: 2026,
      createdAt: new Date('2027-01-02T00:00:00Z'),
    };
    assert.equal(occasionYearOf(exchange), 2026);
  });

  it('falls a null year back to when the row was opened', () => {
    assert.equal(
      occasionYearOf({ year: null, createdAt: new Date('2025-06-01') }),
      2025,
    );
    assert.equal(
      occasionYearOf({ year: null, createdAt: '2023-01-09T10:00:00Z' }),
      2023,
    );
  });
});

describe('heldForCurrentOccasion', () => {
  it('matches the year column outright', () => {
    const [byYear] = heldForCurrentOccasion(EARLY_JANUARY).OR;
    assert.deepEqual(byYear, { year: 2026 });
  });

  it('judges only null-year rows by when they were opened', () => {
    const [, byCreatedAt] = heldForCurrentOccasion(EARLY_JANUARY).OR;
    assert.equal(byCreatedAt.year, null);
    assert.deepEqual(byCreatedAt.createdAt, {
      gte: new Date('2026-01-01'),
      lt: new Date('2027-01-01'),
    });
  });
});

describe('withinDrawHistory', () => {
  it('reaches back one Occasion, not one calendar year', () => {
    const [byYear, byCreatedAt] = withinDrawHistory(EARLY_JANUARY).OR;
    // In January 2027 the Occasion in play is 2026, so history starts at 2025.
    assert.deepEqual(byYear, { year: { gte: 2025 } });
    assert.equal(byCreatedAt.year, null);
    assert.deepEqual(byCreatedAt.createdAt, { gte: new Date('2025-01-01') });
  });
});

describe('partitionBySeason', () => {
  const events = [
    { id: 'old', year: 2024, createdAt: new Date('2024-11-02T00:00:00Z') },
    {
      id: 'now-early',
      year: 2026,
      createdAt: new Date('2026-02-14T00:00:00Z'),
    },
    { id: 'last', year: 2025, createdAt: new Date('2025-12-01T00:00:00Z') },
    { id: 'now-late', year: 2026, createdAt: new Date('2026-07-04T00:00:00Z') },
  ];

  it('splits on the Occasion, not on an arbitrary cutoff', () => {
    const { current, past, year } = partitionBySeason(events, MID_SEASON);
    assert.equal(year, 2026);
    assert.deepEqual(
      current.map((e) => e.id),
      ['now-late', 'now-early'],
    );
    assert.deepEqual(
      past.map((e) => e.id),
      ['last', 'old'],
    );
  });

  it('orders newest first in both halves', () => {
    const { current, past } = partitionBySeason(events, MID_SEASON);
    for (const half of [current, past]) {
      const times = half.map((e) => new Date(e.createdAt).getTime());
      assert.deepEqual(
        times,
        [...times].sort((a, b) => b - a),
      );
    }
  });

  it('does not mutate its input', () => {
    const input = [...events];
    partitionBySeason(input, MID_SEASON);
    assert.deepEqual(input, events);
  });

  it('accepts serialised dates, as a client component receives them', () => {
    const { current } = partitionBySeason(
      [{ id: 'x', year: null, createdAt: '2026-03-01T00:00:00Z' }],
      MID_SEASON,
    );
    assert.equal(current.length, 1);
  });

  it('drops nothing: current and past account for every item', () => {
    const { current, past } = partitionBySeason(events, MID_SEASON);
    assert.equal(current.length + past.length, events.length);
  });

  it('keeps a January exchange current instead of ageing it out overnight', () => {
    // The whole point of the column: on January 2nd, an exchange held for
    // Christmas 2026 is still the one in play.
    const { current, past, year } = partitionBySeason(
      [
        { id: 'this-christmas', year: 2026, createdAt: new Date('2027-01-02') },
        { id: 'last-christmas', year: 2025, createdAt: new Date('2025-12-01') },
      ],
      EARLY_JANUARY,
    );
    assert.equal(year, 2026);
    assert.deepEqual(
      current.map((e) => e.id),
      ['this-christmas'],
    );
    assert.deepEqual(
      past.map((e) => e.id),
      ['last-christmas'],
    );
  });
});

describe('nextChristmas', () => {
  it('stays in this year before the 25th', () => {
    assert.equal(nextChristmas(new Date(2026, 7, 1)).getFullYear(), 2026);
  });

  it('rolls to next year once the 25th has passed', () => {
    assert.equal(nextChristmas(new Date(2026, 11, 26)).getFullYear(), 2027);
  });

  it('counts down to zero on the day', () => {
    assert.equal(daysUntilChristmas(new Date(2026, 11, 25)), 0);
  });

  it('counts whole days remaining', () => {
    assert.equal(daysUntilChristmas(new Date(2026, 11, 18)), 7);
  });
});

describe('christmasProgress', () => {
  it('is full on the day itself', () => {
    assert.equal(christmasProgress(new Date(2026, 11, 25)), 100);
  });

  it('restarts the day after', () => {
    assert.equal(christmasProgress(new Date(2026, 11, 26)), 0);
  });

  it('is about half way by midsummer', () => {
    const half = christmasProgress(new Date(2026, 5, 25));
    assert.ok(half > 45 && half < 55, `expected ~50, got ${half}`);
  });

  it('climbs as the day approaches', () => {
    assert.ok(
      christmasProgress(new Date(2026, 11, 18)) >
        christmasProgress(new Date(2026, 9, 18)),
    );
  });
});
