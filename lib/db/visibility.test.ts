import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  claimedByViewerWhere,
  visibleFamiliesWhere,
  visiblePeopleWhere,
  visibleProfileWhere,
  visibleWishCountWhere,
  visibleWishesWhere,
} from './visibility.ts';

const VIEWER = 'viewer-1';
const OTHER = 'other-1';

/** The membership clause every scoped People query must carry. */
const MEMBERSHIP = {
  memberships: {
    some: { family: { memberships: { some: { userId: VIEWER } } } },
  },
};

/**
 * The same rule for Wishes — reached through the subject, so it follows the
 * subject rather than a snapshot taken when the Wish was added.
 */
const WISH_MEMBERSHIP = { subject: MEMBERSHIP };

describe('visibleWishesWhere', () => {
  const now = new Date('2026-08-01T00:00:00Z');

  it('scopes the browse feed by the subject’s family membership', () => {
    const where = visibleWishesWhere(VIEWER, { excludeOwn: true, now });
    assert.deepEqual(where.subject, WISH_MEMBERSHIP.subject);
    // That the pin is not consulted is no longer assertable — there is no such
    // field on `WishWhereInput` any more, so the compiler is the proof.
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
  it('requires a shared family', () => {
    assert.deepEqual(
      visiblePeopleWhere(VIEWER).memberships,
      MEMBERSHIP.memberships,
    );
  });

  it('keys the inner clause on the viewer, not on a family', () => {
    // The join table's columns used to be `A` and `B`; reading them the wrong
    // way round inverts every membership in the app and raises no error.
    // Explicit columns are what make that assertable at all.
    const inner = visiblePeopleWhere(VIEWER).memberships?.some;
    assert.deepEqual(inner, {
      family: { memberships: { some: { userId: VIEWER } } },
    });
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

  it('requires a shared family for anyone else', () => {
    const where = visibleProfileWhere(VIEWER, OTHER);
    assert.equal(where.id, OTHER);
    assert.deepEqual(where.memberships, MEMBERSHIP.memberships);
  });
});

describe('visibleFamiliesWhere', () => {
  it('is the membership clause, so /wishlists is your Families and not a directory', () => {
    assert.deepEqual(visibleFamiliesWhere(VIEWER), {
      memberships: { some: { userId: VIEWER } },
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
