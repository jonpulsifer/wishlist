/**
 * How far through their shopping the viewer is.
 *
 * "Sorted" is not a column and never should be — it is simply "the viewer has
 * claimed at least one Wish for this person". Two screens ask the question now
 * (Home and the sidebar), so the definition lives here once rather than being
 * re-derived at each call site.
 *
 * No Prisma import and no database: it takes the rows and answers.
 */

type Person = { id: string; wishCount: number };
type ClaimedWish = { subject: { id: string } };

/** A Wish as far as this module cares: does it carry a claim by the viewer. */
type MaybeClaimed = { yours: true } | { yours: false; viewerClaim: number };

/** The same rule as `shoppingProgress`, asked of one person's Wishes. */
export function sortedForPerson(wishes: MaybeClaimed[]): boolean {
  return wishes.some((wish) => !wish.yours && wish.viewerClaim > 0);
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

export function shoppingProgress<P extends Person, G extends ClaimedWish>(
  people: P[],
  claimedByViewer: G[],
): ShoppingProgress<P, G> {
  const claimedFor = new Map<string, G[]>();
  for (const wish of claimedByViewer) {
    const forSubject = claimedFor.get(wish.subject.id) ?? [];
    forSubject.push(wish);
    claimedFor.set(wish.subject.id, forSubject);
  }

  const toShopFor = people
    .filter((p) => !claimedFor.has(p.id))
    .sort((a, b) => b.wishCount - a.wishCount);
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
