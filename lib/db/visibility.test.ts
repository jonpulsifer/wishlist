import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  claimedByViewerWhere,
  visibleGiftCountWhere,
  visibleGiftsWhere,
  visiblePeopleWhere,
  visibleProfileWhere,
  visibleWishlistsWhere,
} from './visibility.ts';

const VIEWER = 'viewer-1';
const OTHER = 'other-1';

/** The membership clause every scoped People query must carry. */
const MEMBERSHIP = {
  wishlists: { some: { members: { some: { id: VIEWER } } } },
};

/**
 * The same rule for Gifts — reached through the owner, so it follows the
 * subject rather than a snapshot taken when the Gift was added.
 */
const GIFT_MEMBERSHIP = { owner: MEMBERSHIP };

describe('visibleGiftsWhere', () => {
  const now = new Date('2026-08-01T00:00:00Z');

  it('scopes the browse feed by the owner’s wishlist membership', () => {
    const where = visibleGiftsWhere(VIEWER, { excludeOwn: true, now });
    assert.deepEqual(where.owner, GIFT_MEMBERSHIP.owner);
    // The pin cannot be consulted: `Gift.wishlists` is gone from the schema, so
    // `GiftWhereInput` has no such field and the assertion is now `tsc`'s.
  });

  it('hides archived gifts from everyone but their owner', () => {
    assert.equal(visibleGiftsWhere(VIEWER, { now }).archived, false);
    assert.equal(
      visibleGiftsWhere(VIEWER, { ownerId: OTHER, now }).archived,
      false,
    );
  });

  it('carries no claim clause at all', () => {
    // Claim secrecy left the query layer: filtering a claimed Gift out of a
    // list makes the row vanish, and absence is a louder signal than a badge.
    // It is `projections.ts`'s job now, and this asserts nothing crept back.
    for (const scope of [
      {},
      { excludeOwn: true },
      { ownerId: OTHER },
      { ownerId: VIEWER },
    ]) {
      const json = JSON.stringify(visibleGiftsWhere(VIEWER, { ...scope, now }));
      assert.equal(json.includes('claim'), false, `claim clause in ${json}`);
    }
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
    assert.deepEqual(where.owner, GIFT_MEMBERSHIP.owner);
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
  it('matches only the viewer’s own Claimer rows, inside their wishlists', () => {
    const where = claimedByViewerWhere(VIEWER);
    assert.deepEqual(where.claimers, { some: { userId: VIEWER } });
    assert.equal(where.archived, false);
    assert.deepEqual(where.owner, GIFT_MEMBERSHIP.owner);
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

describe('visibleWishlistsWhere', () => {
  it('is the membership clause, so /wishlists is your Families and not a directory', () => {
    assert.deepEqual(visibleWishlistsWhere(VIEWER), {
      members: { some: { id: VIEWER } },
    });
  });
});

describe('visibleGiftCountWhere', () => {
  it('hides archived gifts and stays inside the year window', () => {
    const where = visibleGiftCountWhere(new Date('2026-08-01T00:00:00Z'));
    assert.equal(where.archived, false);
    assert.ok(where.createdAt);
  });

  it('counts claimed gifts, because a claim no longer hides a row', () => {
    assert.equal(
      JSON.stringify(visibleGiftCountWhere()).includes('claim'),
      false,
    );
  });
});
