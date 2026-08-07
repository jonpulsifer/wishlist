import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  editableWishWhere,
  organiserOfWhere,
  subjectOfWhere,
} from './authority.ts';

const VIEWER = 'viewer-1';

describe('subjectOfWhere', () => {
  it('is the subject and nothing else', () => {
    assert.deepEqual(subjectOfWhere(VIEWER), { subjectId: VIEWER });
  });
});

describe('editableWishWhere', () => {
  it('admits the subject and the proposer, and no one else', () => {
    // Both arms matter: a Suggestion is the proposer's to correct, and
    // deleting it is how they withdraw it.
    assert.deepEqual(editableWishWhere(VIEWER), {
      OR: [{ subjectId: VIEWER }, { proposerId: VIEWER }],
    });
  });

  it('is wider than the authority archiving now takes', () => {
    // Archiving is `subjectOfWhere`, which is one of these two arms — a
    // proposer archiving their own Suggestion strands the row past every
    // reader, so the narrowing is the fix for #178.
    const editable = editableWishWhere(VIEWER);
    assert.deepEqual(editable.OR?.[0], subjectOfWhere(VIEWER));
    assert.equal(editable.OR?.length, 2);
  });
});

describe('organiserOfWhere', () => {
  it('is the person who opened the Exchange', () => {
    assert.deepEqual(organiserOfWhere(VIEWER), { organiserId: VIEWER });
  });
});
