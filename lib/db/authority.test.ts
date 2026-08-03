import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  editableGiftWhere,
  organiserOfWhere,
  subjectOfWhere,
} from './authority.ts';

const VIEWER = 'viewer-1';

describe('subjectOfWhere', () => {
  it('is ownership and nothing else', () => {
    assert.deepEqual(subjectOfWhere(VIEWER), { ownerId: VIEWER });
  });
});

describe('editableGiftWhere', () => {
  it('admits the subject and the creator, and no one else', () => {
    // Both arms matter until Step 12: dropping the creator arm takes away
    // correcting a Suggestion you made for someone else.
    assert.deepEqual(editableGiftWhere(VIEWER), {
      OR: [{ ownerId: VIEWER }, { createdById: VIEWER }],
    });
  });
});

describe('organiserOfWhere', () => {
  it('is the person who opened the event', () => {
    assert.deepEqual(organiserOfWhere(VIEWER), { createdById: VIEWER });
  });
});
