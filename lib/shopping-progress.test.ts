import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { shoppingProgress, sortedForPerson } from './shopping-progress';

const person = (id: string, wishCount = 0) => ({ id, wishCount });
const claim = (subjectId: string) => ({ subject: { id: subjectId } });

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

  it('counts a person once however many Wishes are claimed for them', () => {
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

describe('sortedForPerson', () => {
  it('is true once the viewer has claimed any one of the Wishes', () => {
    assert.equal(
      sortedForPerson([
        { yours: false, claimedByViewer: false },
        { yours: false, claimedByViewer: true },
      ]),
      true,
    );
  });

  it('ignores Wishes claimed by somebody else', () => {
    assert.equal(
      sortedForPerson([{ yours: false, claimedByViewer: false }]),
      false,
    );
  });

  it("never counts the viewer's own Wishes, which carry no claim state", () => {
    assert.equal(sortedForPerson([{ yours: true }, { yours: true }]), false);
  });

  it('is false for an empty list', () => {
    assert.equal(sortedForPerson([]), false);
  });
});
