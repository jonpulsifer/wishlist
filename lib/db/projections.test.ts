import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { type GiftCard, toGiftCard } from './projections.ts';

const VIEWER = 'viewer-1';
const OWNER = 'owner-1';
const STRANGER = 'stranger-1';

const someone = (id: string) => ({
  id,
  name: `Person ${id}`,
  email: `${id}@example.com`,
  image: null,
});

function giftRow(overrides: Partial<Parameters<typeof toGiftCard>[0]> = {}) {
  return {
    id: 'gift-1',
    name: 'A nice thing',
    url: null,
    description: null,
    createdAt: new Date('2026-06-01'),
    archived: false,
    ownerId: OWNER,
    createdById: OWNER,
    owner: someone(OWNER),
    createdBy: someone(OWNER),
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
    const card = toGiftCard(giftRow(claimedBy(STRANGER)), VIEWER);
    assert.equal('claimers' in card, false);
  });

  it('never carries createdById across the seam', () => {
    const card = toGiftCard(giftRow(), VIEWER);
    assert.equal('createdById' in card, false);
  });

  it("reduces someone else's claim to the bare fact that it is claimed", () => {
    const card = toGiftCard(giftRow(claimedBy(STRANGER)), VIEWER);
    assert.equal(card.yours, false);
    assert.equal(card.yours === false && card.claimed, true);
    assert.equal(card.yours === false && card.claimedByViewer, false);
    // Nothing anywhere in the payload names the claimer.
    assert.equal(JSON.stringify(card).includes(STRANGER), false);
  });

  it('tells the viewer about their own claim', () => {
    const card = toGiftCard(giftRow(claimedBy(VIEWER)), VIEWER);
    assert.equal(card.yours === false && card.claimedByViewer, true);
  });

  it('reads an unclaimed gift as unclaimed by the viewer', () => {
    const card = toGiftCard(giftRow(), VIEWER);
    assert.equal(card.yours === false && card.claimedByViewer, false);
  });

  // The whole point of the step: the person a gift is *for* receives a payload
  // with no claim state in it. Not false — absent. A component cannot read what
  // is not there, and `tsc` refuses to let one try.
  it('gives the subject a card with no claim state at all', () => {
    const card = toGiftCard(giftRow(claimedBy(STRANGER)), OWNER);
    assert.equal(card.yours, true);
    assert.equal('claimed' in card, false);
    assert.equal('claimedByViewer' in card, false);
    assert.equal(JSON.stringify(card).includes(STRANGER), false);
  });

  it('keeps the subject’s card claim-free even when nobody has claimed it', () => {
    // Otherwise the presence of the field is itself the signal.
    const card = toGiftCard(giftRow(), OWNER);
    assert.equal('claimed' in card, false);
  });
});

describe('canEdit', () => {
  it('is true for the owner', () => {
    const card = toGiftCard(giftRow({ ownerId: VIEWER }), VIEWER);
    assert.equal(card.canEdit, true);
  });

  it('is true for whoever created it', () => {
    const card = toGiftCard(giftRow({ createdById: VIEWER }), VIEWER);
    assert.equal(card.canEdit, true);
  });

  it('is false for anyone else', () => {
    const card = toGiftCard(giftRow(), STRANGER);
    assert.equal(card.canEdit, false);
  });

  it('is false when the gift has no creator recorded', () => {
    const card = toGiftCard(
      giftRow({ createdById: null as unknown as string, createdBy: null }),
      VIEWER,
    );
    assert.equal(card.canEdit, false);
  });
});

describe('the card the view receives', () => {
  it('carries exactly the fields GiftCard declares', () => {
    const card = toGiftCard(giftRow(), VIEWER);
    const expected: Array<keyof Extract<GiftCard, { yours: false }>> = [
      'id',
      'name',
      'url',
      'description',
      'createdAt',
      'archived',
      'yours',
      'claimed',
      'claimedByViewer',
      'ownerId',
      'owner',
      'createdBy',
      'canEdit',
    ];
    assert.deepEqual(Object.keys(card).sort(), [...expected].sort());
  });

  it('carries exactly the fields the subject’s card declares', () => {
    const card = toGiftCard(giftRow(), OWNER);
    const expected: Array<keyof Extract<GiftCard, { yours: true }>> = [
      'id',
      'name',
      'url',
      'description',
      'createdAt',
      'archived',
      'yours',
      'ownerId',
      'owner',
      'createdBy',
      'canEdit',
    ];
    assert.deepEqual(Object.keys(card).sort(), [...expected].sort());
  });

  it('passes the owner through as a reference, not a full row', () => {
    const card = toGiftCard(giftRow(), VIEWER);
    assert.deepEqual(Object.keys(card.owner).sort(), [
      'email',
      'id',
      'image',
      'name',
    ]);
  });
});
