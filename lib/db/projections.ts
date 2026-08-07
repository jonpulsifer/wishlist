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
 * The claimers are read in full and forwarded to almost nobody — `toWishCard`
 * reduces them to a count, names them only to the people who are already among
 * them, and drops them entirely for the person the Wish is for. Who claimed a
 * Wish is the one secret this app keeps, and it should not be sitting in the
 * page source.
 *
 * Ordered oldest first, which is what makes "Jon started this" a fact about the
 * rows rather than a field.
 */
export const wishRowSelect = {
  id: true,
  name: true,
  url: true,
  description: true,
  createdAt: true,
  archived: true,
  quantity: true,
  subjectId: true,
  proposerId: true,
  subject: { select: personRefSelect },
  proposer: { select: personRefSelect },
  claimers: {
    select: { userId: true, quantity: true, user: { select: personRefSelect } },
    orderBy: { createdAt: 'asc' },
  },
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
  /** How many of the thing its subject wants. One, for almost every Wish. */
  quantity: number;
  /** The viewer is the subject or the proposer, so may edit and delete it. */
  canEdit: boolean;
};

/**
 * A Wish as rendered in a list.
 *
 * Surprise is the shape of this type, not a value inside it. The person a Wish
 * is *for* receives a payload with no claim state at all — not `false`,
 * **absent** — so no component can read it and no future component can start
 * (ADR-0004). Everyone else's payload says how much of it is spoken for,
 * because a claimed Wish has to stay visible-as-claimed or nobody can find the
 * claim to join it.
 *
 * `yours` is the discriminant, so the compiler is the proof rather than a code
 * review.
 *
 * `claimers` is the second discriminant, and the finer one: it is populated
 * only for someone already among them. Claimers can see each other because they
 * cannot coordinate otherwise; everyone else gets the count and no names.
 */
export type WishCard = WishCardBase &
  (
    | { yours: true }
    | {
        yours: false;
        /** Nothing of it is left to speak for: `spokenFor >= quantity`. */
        claimed: boolean;
        /** How many of the `quantity` are spoken for. */
        spokenFor: number;
        /** True only when the viewer is a claimer. Others' claims read as a count. */
        claimedByViewer: boolean;
        /**
         * The other claimers, oldest first — empty unless the viewer is one of
         * them. Never includes the viewer.
         */
        joinedBy: PersonRef[];
      }
  );

export function toWishCard(row: WishRow, viewerId: string): WishCard {
  const { claimers, proposerId, ...rest } = row;
  const base = {
    ...rest,
    canEdit: row.subjectId === viewerId || proposerId === viewerId,
  };

  if (row.subjectId === viewerId) return { ...base, yours: true };

  const spokenFor = claimers.reduce((total, c) => total + c.quantity, 0);
  const claimedByViewer = claimers.some((c) => c.userId === viewerId);

  return {
    ...base,
    yours: false,
    claimed: spokenFor >= row.quantity,
    spokenFor,
    claimedByViewer,
    joinedBy: claimedByViewer
      ? claimers.filter((c) => c.userId !== viewerId).map((c) => c.user)
      : [],
  };
}

/**
 * The card as it looks the instant the viewer claims or unclaims, before the
 * server answers.
 *
 * Four screens run this optimism and each had its own copy of it. With a
 * quantity the derivation is no longer a flipped boolean — `claimed` follows
 * from the sum — so it lives here beside the rule it has to agree with.
 */
export function toggleViewerClaim(card: WishCard, amount = 1): WishCard {
  if (card.yours) return card;

  const claiming = !card.claimedByViewer;
  const spokenFor = Math.max(0, card.spokenFor + (claiming ? amount : -amount));

  return {
    ...card,
    claimedByViewer: claiming,
    spokenFor,
    claimed: spokenFor >= card.quantity,
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
