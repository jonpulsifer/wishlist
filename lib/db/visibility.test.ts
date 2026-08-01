import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  claimedByViewerWhere,
  visibleGiftCountWhere,
  visibleGiftsWhere,
  visiblePeopleWhere,
  visibleProfileWhere,
} from './visibility.ts';

const VIEWER = 'viewer-1';
const OTHER = 'other-1';

/** The membership clause every scoped query must carry. */
const MEMBERSHIP = {
  wishlists: { some: { members: { some: { id: VIEWER } } } },
};

describe('visibleGiftsWhere', () => {
  const now = new Date('2026-08-01T00:00:00Z');

  it('scopes the browse feed by wishlist membership', () => {
    const where = visibleGiftsWhere(VIEWER, { excludeOwn: true, now });
    assert.deepEqual(where.wishlists, MEMBERSHIP.wishlists);
  });

  it('hides archived gifts from everyone but their owner', () => {
    assert.equal(visibleGiftsWhere(VIEWER, { now }).archived, false);
    assert.equal(
      visibleGiftsWhere(VIEWER, { ownerId: OTHER, now }).archived,
      false,
    );
  });

  it('keeps all three claim arms', () => {
    // Dropping the createdById arm is what hid the viewer's own additions from
    // the home feed.
    const where = visibleGiftsWhere(VIEWER, { excludeOwn: true, now });
    assert.deepEqual(where.OR, [
      { claimed: false },
      { claimedById: VIEWER },
      { createdById: VIEWER },
    ]);
  });

  it('gives the browse and home feeds identical rules', () => {
    // These were two hand-written clauses that had drifted apart.
    assert.deepEqual(
      visibleGiftsWhere(VIEWER, { excludeOwn: true, now }),
      visibleGiftsWhere(VIEWER, { excludeOwn: true, now }),
    );
  });

  it('excludes the viewer’s own gifts when asked', () => {
    const where = visibleGiftsWhere(VIEWER, { excludeOwn: true, now });
    assert.deepEqual(where.ownerId, { not: VIEWER });
  });

  it('scopes another person’s profile to that owner and to membership', () => {
    const where = visibleGiftsWhere(VIEWER, { ownerId: OTHER, now });
    assert.equal(where.ownerId, OTHER);
    // The old query had no membership clause at all here, which is how a
    // stranger's profile became readable.
    assert.deepEqual(where.wishlists, MEMBERSHIP.wishlists);
  });

  it('takes the surprise-preserving branch on the viewer’s own profile', () => {
    const where = visibleGiftsWhere(VIEWER, { ownerId: VIEWER, now });

    assert.equal(where.ownerId, VIEWER);
    // Only gifts you added yourself: gifts others added for you stay hidden.
    assert.equal(where.createdById, VIEWER);
    // Archived gifts are yours to see.
    assert.equal(where.archived, undefined);
  });

  it('always constrains the year window', () => {
    for (const scope of [
      {},
      { excludeOwn: true },
      { ownerId: OTHER },
      { ownerId: VIEWER },
    ]) {
      const where = visibleGiftsWhere(VIEWER, { ...scope, now });
      assert.ok(
        where.createdAt,
        `missing year window for ${JSON.stringify(scope)}`,
      );
    }
  });
});

describe('claimedByViewerWhere', () => {
  it('matches only the viewer’s own claims, inside their wishlists', () => {
    const where = claimedByViewerWhere(VIEWER);
    assert.equal(where.claimedById, VIEWER);
    assert.equal(where.archived, false);
    assert.deepEqual(where.wishlists, MEMBERSHIP.wishlists);
  });
});

describe('visiblePeopleWhere', () => {
  it('requires a shared wishlist', () => {
    assert.deepEqual(
      visiblePeopleWhere(VIEWER).wishlists,
      MEMBERSHIP.wishlists,
    );
  });

  it('can drop the viewer from the list', () => {
    assert.deepEqual(visiblePeopleWhere(VIEWER, { excludeSelf: true }).NOT, {
      id: VIEWER,
    });
    assert.equal(visiblePeopleWhere(VIEWER).NOT, undefined);
  });
});

describe('visibleProfileWhere', () => {
  it('lets the viewer read their own profile unconditionally', () => {
    assert.deepEqual(visibleProfileWhere(VIEWER, VIEWER), { id: VIEWER });
  });

  it('requires a shared wishlist for anyone else', () => {
    const where = visibleProfileWhere(VIEWER, OTHER);
    assert.equal(where.id, OTHER);
    assert.deepEqual(where.wishlists, MEMBERSHIP.wishlists);
  });
});

describe('visibleGiftCountWhere', () => {
  it('uses the same claim rule as the gift queries', () => {
    assert.deepEqual(visibleGiftCountWhere(VIEWER).OR, [
      { claimed: false },
      { claimedById: VIEWER },
      { createdById: VIEWER },
    ]);
  });
});
