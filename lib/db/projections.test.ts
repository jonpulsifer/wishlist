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
    quantity: 1,
    subject: someone(SUBJECT),
    proposer: someone(SUBJECT),
    claimers: [] as Claimer[],
    ...overrides,
  };
}

type Claimer = {
  userId: string;
  quantity: number;
  user: ReturnType<typeof someone>;
};

const claimer = (userId: string, quantity = 1): Claimer => ({
  userId,
  quantity,
  user: someone(userId),
});

const claimedBy = (...userIds: string[]) => ({
  claimers: userIds.map((userId) => claimer(userId)),
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

describe('quantity and splitting', () => {
  it('is claimed when one person speaks for the only one wanted', () => {
    const card = toWishCard(wishRow(claimedBy(STRANGER)), VIEWER);
    assert.equal(card.yours === false && card.claimed, true);
    assert.equal(card.yours === false && card.spokenFor, 1);
  });

  it('is not claimed while some of it is still unspoken for', () => {
    const card = toWishCard(
      wishRow({ quantity: 5, claimers: [claimer(STRANGER, 2)] }),
      VIEWER,
    );
    assert.equal(card.yours === false && card.claimed, false);
    assert.equal(card.yours === false && card.spokenFor, 2);
  });

  it('sums the claimers rather than counting them', () => {
    const card = toWishCard(
      wishRow({
        quantity: 5,
        claimers: [claimer(STRANGER, 2), claimer(VIEWER, 3)],
      }),
      VIEWER,
    );
    assert.equal(card.yours === false && card.spokenFor, 5);
    assert.equal(card.yours === false && card.claimed, true);
  });

  it('treats over-speaking as claimed rather than as an error', () => {
    // The action refuses it; the projection is not the place to be surprised.
    const card = toWishCard(
      wishRow({ quantity: 1, claimers: [claimer(STRANGER, 4)] }),
      VIEWER,
    );
    assert.equal(card.yours === false && card.claimed, true);
  });
});

describe('who the claimers may see', () => {
  it('names the others to someone already among them', () => {
    const card = toWishCard(
      wishRow({
        quantity: 3,
        claimers: [claimer(STRANGER), claimer(VIEWER)],
      }),
      VIEWER,
    );
    assert.deepEqual(
      card.yours === false ? card.joinedBy.map((p) => p.id) : [],
      [STRANGER],
    );
  });

  it('never names the viewer back to themselves', () => {
    const card = toWishCard(wishRow(claimedBy(VIEWER)), VIEWER);
    assert.deepEqual(card.yours === false && card.joinedBy, []);
  });

  it('names nobody to someone who has not joined', () => {
    const card = toWishCard(
      wishRow({ quantity: 3, claimers: [claimer(STRANGER)] }),
      VIEWER,
    );
    assert.deepEqual(card.yours === false && card.joinedBy, []);
    // And the count still crosses, because a claim nobody can see is a claim
    // nobody can join.
    assert.equal(card.yours === false && card.spokenFor, 1);
    assert.equal(JSON.stringify(card).includes(STRANGER), false);
  });

  it('keeps the order the claims were made in', () => {
    const first = 'first-1';
    const card = toWishCard(
      wishRow({
        quantity: 4,
        claimers: [claimer(first), claimer(VIEWER), claimer(STRANGER)],
      }),
      VIEWER,
    );
    assert.deepEqual(
      card.yours === false ? card.joinedBy.map((p) => p.id) : [],
      [first, STRANGER],
    );
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
      'spokenFor',
      'claimedByViewer',
      'joinedBy',
      'quantity',
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
      'quantity',
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
