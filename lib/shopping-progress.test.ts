import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { shoppingProgress } from './shopping-progress';

const person = (id: string, giftCount = 0) => ({ id, giftCount });
const claim = (ownerId: string) => ({ owner: { id: ownerId } });

describe('shoppingProgress', () => {
  it('moves a person out of the shopping list once claimed for', () => {
    const { toShopFor, sortedPeople, percent } = shoppingProgress(
      [person('a'), person('b')],
      [claim('a')],
    );
    assert.deepEqual(
      sortedPeople.map((p) => p.id),
      ['a'],
    );
    assert.deepEqual(
      toShopFor.map((p) => p.id),
      ['b'],
    );
    assert.equal(percent, 50);
  });

  it('puts people with ideas on their list first', () => {
    const { toShopFor } = shoppingProgress(
      [person('a', 0), person('b', 7), person('c', 2)],
      [],
    );
    assert.deepEqual(
      toShopFor.map((p) => p.id),
      ['b', 'c', 'a'],
    );
  });

  it('counts a person once however many gifts are claimed for them', () => {
    const { sortedPeople, claimedFor, percent } = shoppingProgress(
      [person('a')],
      [claim('a'), claim('a')],
    );
    assert.equal(sortedPeople.length, 1);
    assert.equal(claimedFor.get('a')?.length, 2);
    assert.equal(percent, 100);
  });

  it('reports 0 percent rather than NaN when there is nobody to shop for', () => {
    assert.equal(shoppingProgress([], []).percent, 0);
  });
});
