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
    claimed: false,
    claimedById: null as string | null,
    ownerId: OWNER,
    createdById: OWNER,
    owner: someone(OWNER),
    createdBy: someone(OWNER),
    ...overrides,
  };
}

describe('claim secrecy', () => {
  // Who claimed a gift is the one secret this app keeps. `claimedById` is read
  // by the query and must not survive the projection.
  it('never carries claimedById across the seam', () => {
    const card = toGiftCard(
      giftRow({ claimed: true, claimedById: STRANGER }),
      VIEWER,
    );
    assert.equal('claimedById' in card, false);
  });

  it('never carries createdById across the seam', () => {
    const card = toGiftCard(giftRow(), VIEWER);
    assert.equal('createdById' in card, false);
  });

  it("reduces someone else's claim to the bare fact that it is claimed", () => {
    const card = toGiftCard(
      giftRow({ claimed: true, claimedById: STRANGER }),
      VIEWER,
    );
    assert.equal(card.claimed, true);
    assert.equal(card.claimedByViewer, false);
    // Nothing anywhere in the payload names the claimer.
    assert.equal(JSON.stringify(card).includes(STRANGER), false);
  });

  it('tells the viewer about their own claim', () => {
    const card = toGiftCard(
      giftRow({ claimed: true, claimedById: VIEWER }),
      VIEWER,
    );
    assert.equal(card.claimedByViewer, true);
  });

  it('reads an unclaimed gift as unclaimed by the viewer', () => {
    const card = toGiftCard(
      giftRow({ claimed: false, claimedById: null }),
      VIEWER,
    );
    assert.equal(card.claimedByViewer, false);
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
    const expected: Array<keyof GiftCard> = [
      'id',
      'name',
      'url',
      'description',
      'createdAt',
      'archived',
      'claimed',
      'claimedByViewer',
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
