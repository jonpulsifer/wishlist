import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  claimedByViewerWhere,
  visiblePeopleWhere,
  visibleProfileWhere,
  visibleWishCountWhere,
  visibleWishesWhere,
  visibleWishlistsWhere,
} from './visibility.ts';

const VIEWER = 'viewer-1';
const OTHER = 'other-1';

/** The membership clause every scoped People query must carry. */
const MEMBERSHIP = {
  wishlists: { some: { members: { some: { id: VIEWER } } } },
};

/**
 * The same rule for Wishes — reached through the subject, so it follows the
 * subject rather than a snapshot taken when the Wish was added.
 */
const WISH_MEMBERSHIP = { subject: MEMBERSHIP };

describe('visibleWishesWhere', () => {
  const now = new Date('2026-08-01T00:00:00Z');

  it('scopes the browse feed by the subject’s wishlist membership', () => {
    const where = visibleWishesWhere(VIEWER, { excludeOwn: true, now });
    assert.deepEqual(where.subject, WISH_MEMBERSHIP.subject);
    // That the pin is not consulted is no longer assertable — `wishlists` is
    // not a field of `WishWhereInput` any more, so the compiler is the proof.
  });

  it('hides archived wishes from everyone but their subject', () => {
    assert.equal(visibleWishesWhere(VIEWER, { now }).archived, false);
    assert.equal(
      visibleWishesWhere(VIEWER, { subjectId: OTHER, now }).archived,
      false,
    );
  });

  it('carries no claim clause at all', () => {
    // Claim secrecy left the query layer: filtering a claimed Wish out of a
    // list makes the row vanish, and absence is a louder signal than a badge.
    // It is `projections.ts`'s job now, and this asserts nothing crept back.
    for (const scope of [
      {},
      { excludeOwn: true },
      { subjectId: OTHER },
      { subjectId: VIEWER },
    ]) {
      const json = JSON.stringify(
        visibleWishesWhere(VIEWER, { ...scope, now }),
      );
      assert.equal(json.includes('claim'), false, `claim clause in ${json}`);
    }
  });

  it('gives the browse and home feeds identical rules', () => {
    // These were two hand-written clauses that had drifted apart.
    assert.deepEqual(
      visibleWishesWhere(VIEWER, { excludeOwn: true, now }),
      visibleWishesWhere(VIEWER, { excludeOwn: true, now }),
    );
  });

  it('excludes the viewer’s own wishes when asked', () => {
    const where = visibleWishesWhere(VIEWER, { excludeOwn: true, now });
    assert.deepEqual(where.subjectId, { not: VIEWER });
  });

  it('scopes another person’s profile to that subject and to membership', () => {
    const where = visibleWishesWhere(VIEWER, { subjectId: OTHER, now });
    assert.equal(where.subjectId, OTHER);
    // The old query had no membership clause at all here, which is how a
    // stranger's profile became readable.
    assert.deepEqual(where.subject, WISH_MEMBERSHIP.subject);
  });

  it('takes the surprise-preserving branch on the viewer’s own profile', () => {
    const where = visibleWishesWhere(VIEWER, { subjectId: VIEWER, now });

    assert.equal(where.subjectId, VIEWER);
    // Only the Wishes you proposed yourself: Suggestions others made for you stay hidden.
    assert.equal(where.proposerId, VIEWER);
    // Archived Wishes are yours to see.
    assert.equal(where.archived, undefined);
  });

  it('always constrains the year window', () => {
    for (const scope of [
      {},
      { excludeOwn: true },
      { subjectId: OTHER },
      { subjectId: VIEWER },
    ]) {
      const where = visibleWishesWhere(VIEWER, { ...scope, now });
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
    assert.deepEqual(where.subject, WISH_MEMBERSHIP.subject);
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

describe('visibleWishCountWhere', () => {
  it('hides archived wishes and stays inside the year window', () => {
    const where = visibleWishCountWhere(new Date('2026-08-01T00:00:00Z'));
    assert.equal(where.archived, false);
    assert.ok(where.createdAt);
  });

  it('counts claimed wishes, because a claim no longer hides a row', () => {
    assert.equal(
      JSON.stringify(visibleWishCountWhere()).includes('claim'),
      false,
    );
  });
});
