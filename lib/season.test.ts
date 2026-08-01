import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  currentSeason,
  daysUntilChristmas,
  nextChristmas,
  partitionBySeason,
  yearOf,
} from './season.ts';

const MID_SEASON = new Date('2026-08-01T12:00:00Z');

describe('currentSeason', () => {
  it('names the year in play', () => {
    assert.equal(currentSeason(MID_SEASON).year, 2026);
  });

  it('spans this year and the two before it for gifts', () => {
    const { giftWindow } = currentSeason(MID_SEASON);
    assert.deepEqual(giftWindow.gte, new Date('2024-01-01'));
    assert.deepEqual(giftWindow.lt, new Date('2027-01-01'));
  });

  it('holds events to this year alone', () => {
    const { eventWindow } = currentSeason(MID_SEASON);
    assert.deepEqual(eventWindow.gte, new Date('2026-01-01'));
    assert.deepEqual(eventWindow.lt, new Date('2027-01-01'));
  });

  it('looks back one year for draw history', () => {
    const { drawHistoryWindow } = currentSeason(MID_SEASON);
    assert.deepEqual(drawHistoryWindow.gte, new Date('2025-01-01'));
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

  it('keeps every window half-open and ordered', () => {
    const { giftWindow, eventWindow } = currentSeason(MID_SEASON);
    assert.ok(giftWindow.gte < giftWindow.lt);
    assert.ok(eventWindow.gte < eventWindow.lt);
    // The event window sits inside the gift window.
    assert.ok(eventWindow.gte >= giftWindow.gte);
    assert.deepEqual(eventWindow.lt, giftWindow.lt);
  });
});

describe('partitionBySeason', () => {
  const events = [
    { id: 'old', createdAt: new Date('2024-11-02T00:00:00Z') },
    { id: 'now-early', createdAt: new Date('2026-02-14T00:00:00Z') },
    { id: 'last', createdAt: new Date('2025-12-01T00:00:00Z') },
    { id: 'now-late', createdAt: new Date('2026-07-04T00:00:00Z') },
  ];

  it('splits on the Season, not on an arbitrary cutoff', () => {
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
      [{ id: 'x', createdAt: '2026-03-01T00:00:00Z' }],
      MID_SEASON,
    );
    assert.equal(current.length, 1);
  });

  it('drops nothing: current and past account for every item', () => {
    const { current, past } = partitionBySeason(events, MID_SEASON);
    assert.equal(current.length + past.length, events.length);
  });
});

describe('yearOf', () => {
  it('reads the year off either a Date or a string', () => {
    assert.equal(yearOf({ createdAt: new Date('2025-06-01') }), 2025);
    assert.equal(yearOf({ createdAt: '2023-01-09T10:00:00Z' }), 2023);
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
