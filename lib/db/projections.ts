/**
 * What crosses the seam to the browser.
 *
 * Prisma payload types (`include: { subject: true }`) put whole `User` rows —
 * shipping address, sizes, email, onboarding flags — into the HTML for every
 * Wish in a list. These projections describe what the views actually read, so
 * over-serialising becomes a type error rather than a habit.
 *
 * Rule: Prisma types stay behind this module. Client components import from
 * here, never from `@/prisma/generated/client`.
 */

import type { Prisma } from '@/prisma/generated/client';

/** A person as shown on an avatar or a byline. Enough for `getInitials`. */
export const personRefSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} satisfies Prisma.UserSelect;

export type PersonRef = Prisma.UserGetPayload<{
  select: typeof personRefSelect;
}>;

/**
 * Server-side select for a Wish row.
 *
 * The claimer ids are read but never forwarded — `toWishCard` reduces them to
 * two booleans, and to none at all for the person the Wish is for. Who claimed
 * a Wish is the one secret this app keeps, and it should not be sitting in the
 * page source.
 */
export const wishRowSelect = {
  id: true,
  name: true,
  url: true,
  description: true,
  createdAt: true,
  archived: true,
  subjectId: true,
  proposerId: true,
  subject: { select: personRefSelect },
  proposer: { select: personRefSelect },
  claimers: { select: { userId: true } },
} satisfies Prisma.WishSelect;

type WishRow = Prisma.WishGetPayload<{ select: typeof wishRowSelect }>;

type WishCardBase = {
  id: string;
  name: string;
  url: string | null;
  description: string | null;
  createdAt: Date;
  archived: boolean;
  subjectId: string;
  subject: PersonRef;
  proposer: PersonRef;
  /** The viewer is the subject or the proposer, so may edit and delete it. */
  canEdit: boolean;
};

/**
 * A Wish as rendered in a list.
 *
 * Surprise is the shape of this type, not a value inside it. The person a Wish
 * is *for* receives a payload with no claim state at all — not `false`,
 * **absent** — so no component can read it and no future component can start
 * (ADR-0004). Everyone else's payload says whether it is claimed, because a
 * claimed Wish has to stay visible-as-claimed or nobody can find the claim to
 * join it.
 *
 * `yours` is the discriminant, so the compiler is the proof rather than a code
 * review.
 */
export type WishCard = WishCardBase &
  (
    | { yours: true }
    | {
        yours: false;
        claimed: boolean;
        /** True only when the viewer is a claimer. Others' claims read as `claimed`. */
        claimedByViewer: boolean;
      }
  );

export function toWishCard(row: WishRow, viewerId: string): WishCard {
  const { claimers, proposerId, ...rest } = row;
  const base = {
    ...rest,
    canEdit: row.subjectId === viewerId || proposerId === viewerId,
  };

  if (row.subjectId === viewerId) return { ...base, yours: true };

  return {
    ...base,
    yours: false,
    claimed: claimers.length > 0,
    claimedByViewer: claimers.some((c) => c.userId === viewerId),
  };
}

/** A person as shown on the People index. */
export type PersonCard = PersonRef & { wishCount: number };

/** A person's own profile, including the fields only they should see. */
export const profileSelect = {
  ...personRefSelect,
  address: true,
  pant_size: true,
  shirt_size: true,
  shoe_size: true,
  hasCompletedOnboarding: true,
} satisfies Prisma.UserSelect;

export type Profile = Prisma.UserGetPayload<{ select: typeof profileSelect }>;
