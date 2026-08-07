import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { toWishCard, type WishCard } from './projections.ts';

const VIEWER = 'viewer-1';
const SUBJECT = 'subject-1';
const STRANGER = 'stranger-1';

const someone = (id: string) => ({
  id,
  name: `Person ${id}`,
  email: `${id}@example.com`,
  image: null,
});

function wishRow(overrides: Partial<Parameters<typeof toWishCard>[0]> = {}) {
  return {
    id: 'gift-1',
    name: 'A nice thing',
    url: null,
    description: null,
    createdAt: new Date('2026-06-01'),
    archived: false,
    subjectId: SUBJECT,
    proposerId: SUBJECT,
    subject: someone(SUBJECT),
    proposer: someone(SUBJECT),
    claimers: [] as Array<{ userId: string }>,
    ...overrides,
  };
}

const claimedBy = (...userIds: string[]) => ({
  claimers: userIds.map((userId) => ({ userId })),
});

describe('claim secrecy', () => {
  // Who claimed a gift is the one secret this app keeps. The claimer ids are
  // read by the query and must not survive the projection.
  it('never carries claimer ids across the seam', () => {
    const card = toWishCard(wishRow(claimedBy(STRANGER)), VIEWER);
    assert.equal('claimers' in card, false);
  });

  it('never carries proposerId across the seam', () => {
    const card = toWishCard(wishRow(), VIEWER);
    assert.equal('proposerId' in card, false);
  });

  it("reduces someone else's claim to the bare fact that it is claimed", () => {
    const card = toWishCard(wishRow(claimedBy(STRANGER)), VIEWER);
    assert.equal(card.yours, false);
    assert.equal(card.yours === false && card.claimed, true);
    assert.equal(card.yours === false && card.claimedByViewer, false);
    // Nothing anywhere in the payload names the claimer.
    assert.equal(JSON.stringify(card).includes(STRANGER), false);
  });

  it('tells the viewer about their own claim', () => {
    const card = toWishCard(wishRow(claimedBy(VIEWER)), VIEWER);
    assert.equal(card.yours === false && card.claimedByViewer, true);
  });

  it('reads an unclaimed gift as unclaimed by the viewer', () => {
    const card = toWishCard(wishRow(), VIEWER);
    assert.equal(card.yours === false && card.claimedByViewer, false);
  });

  // The whole point of the step: the person a gift is *for* receives a payload
  // with no claim state in it. Not false — absent. A component cannot read what
  // is not there, and `tsc` refuses to let one try.
  it('gives the subject a card with no claim state at all', () => {
    const card = toWishCard(wishRow(claimedBy(STRANGER)), SUBJECT);
    assert.equal(card.yours, true);
    assert.equal('claimed' in card, false);
    assert.equal('claimedByViewer' in card, false);
    assert.equal(JSON.stringify(card).includes(STRANGER), false);
  });

  it('keeps the subject’s card claim-free even when nobody has claimed it', () => {
    // Otherwise the presence of the field is itself the signal.
    const card = toWishCard(wishRow(), SUBJECT);
    assert.equal('claimed' in card, false);
  });
});

describe('canEdit', () => {
  it('is true for the subject', () => {
    const card = toWishCard(wishRow({ subjectId: VIEWER }), VIEWER);
    assert.equal(card.canEdit, true);
  });

  it('is true for the proposer', () => {
    const card = toWishCard(wishRow({ proposerId: VIEWER }), VIEWER);
    assert.equal(card.canEdit, true);
  });

  it('is false for anyone else', () => {
    const card = toWishCard(wishRow(), STRANGER);
    assert.equal(card.canEdit, false);
  });
});

describe('the card the view receives', () => {
  it('carries exactly the fields WishCard declares', () => {
    const card = toWishCard(wishRow(), VIEWER);
    const expected: Array<keyof Extract<WishCard, { yours: false }>> = [
      'id',
      'name',
      'url',
      'description',
      'createdAt',
      'archived',
      'yours',
      'claimed',
      'claimedByViewer',
      'subjectId',
      'subject',
      'proposer',
      'canEdit',
    ];
    assert.deepEqual(Object.keys(card).sort(), [...expected].sort());
  });

  it('carries exactly the fields the subject’s card declares', () => {
    const card = toWishCard(wishRow(), SUBJECT);
    const expected: Array<keyof Extract<WishCard, { yours: true }>> = [
      'id',
      'name',
      'url',
      'description',
      'createdAt',
      'archived',
      'yours',
      'subjectId',
      'subject',
      'proposer',
      'canEdit',
    ];
    assert.deepEqual(Object.keys(card).sort(), [...expected].sort());
  });

  it('passes the subject through as a reference, not a full row', () => {
    const card = toWishCard(wishRow(), VIEWER);
    assert.deepEqual(Object.keys(card.subject).sort(), [
      'email',
      'id',
      'image',
      'name',
    ]);
  });
});
