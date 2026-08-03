/**
 * How far through their shopping the viewer is.
 *
 * "Sorted" is not a column and never should be — it is simply "the viewer has
 * claimed at least one Gift for this person". Two screens ask the question now
 * (Home and the sidebar), so the definition lives here once rather than being
 * re-derived at each call site.
 *
 * No Prisma import and no database: it takes the rows and answers.
 */

type Person = { id: string; giftCount: number };
type ClaimedGift = { owner: { id: string } };

/** A Gift as far as this module cares: does it carry a claim by the viewer. */
type MaybeClaimed =
  | { yours: true }
  | { yours: false; claimedByViewer: boolean };

/** The same rule as `shoppingProgress`, asked of one person's Gifts. */
export function sortedForPerson(gifts: MaybeClaimed[]): boolean {
  return gifts.some((gift) => !gift.yours && gift.claimedByViewer);
}

export type ShoppingProgress<P, G> = {
  /** People with no claim from the viewer yet, most-actionable first. */
  toShopFor: P[];
  /** People the viewer has already claimed something for. */
  sortedPeople: P[];
  /** What the viewer claimed, keyed by the person it is for. */
  claimedFor: Map<string, G[]>;
  total: number;
  /** 0–100, and 0 rather than NaN when there is nobody to shop for. */
  percent: number;
};

export function shoppingProgress<P extends Person, G extends ClaimedGift>(
  people: P[],
  claimedByViewer: G[],
): ShoppingProgress<P, G> {
  const claimedFor = new Map<string, G[]>();
  for (const gift of claimedByViewer) {
    const forOwner = claimedFor.get(gift.owner.id) ?? [];
    forOwner.push(gift);
    claimedFor.set(gift.owner.id, forOwner);
  }

  const toShopFor = people
    .filter((p) => !claimedFor.has(p.id))
    .sort((a, b) => b.giftCount - a.giftCount);
  const sortedPeople = people.filter((p) => claimedFor.has(p.id));

  return {
    toShopFor,
    sortedPeople,
    claimedFor,
    total: people.length,
    percent: people.length
      ? Math.round((sortedPeople.length / people.length) * 100)
      : 0,
  };
}
