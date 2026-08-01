/**
 * What crosses the seam to the browser.
 *
 * Prisma payload types (`include: { owner: true }`) put whole `User` rows —
 * shipping address, sizes, email, onboarding flags — into the HTML for every
 * Gift in a list. These projections describe what the views actually read, so
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
 * Server-side select for a Gift row.
 *
 * `claimedById` is read but never forwarded — `toGiftCard` turns it into the
 * single boolean the view needs. Who claimed a Gift is the one secret this app
 * keeps, and it should not be sitting in the page source.
 */
export const giftRowSelect = {
  id: true,
  name: true,
  url: true,
  description: true,
  createdAt: true,
  archived: true,
  claimed: true,
  claimedById: true,
  ownerId: true,
  createdById: true,
  owner: { select: personRefSelect },
  createdBy: { select: personRefSelect },
} satisfies Prisma.GiftSelect;

type GiftRow = Prisma.GiftGetPayload<{ select: typeof giftRowSelect }>;

/** A Gift as rendered in a list. No `claimedBy`, by construction. */
export type GiftCard = {
  id: string;
  name: string;
  url: string | null;
  description: string | null;
  createdAt: Date;
  archived: boolean;
  claimed: boolean;
  /** True only when the viewer is the claimer. Others' claims read as `claimed`. */
  claimedByViewer: boolean;
  ownerId: string;
  owner: PersonRef;
  createdBy: PersonRef | null;
  /** The viewer owns or created this Gift, so may edit, archive and delete it. */
  canEdit: boolean;
};

export function toGiftCard(row: GiftRow, viewerId: string): GiftCard {
  const { claimedById, createdById, ...rest } = row;
  return {
    ...rest,
    claimedByViewer: claimedById === viewerId,
    canEdit: row.ownerId === viewerId || createdById === viewerId,
  };
}

/** A Gift on its detail page — the card plus the Wishlists it sits on. */
export type GiftDetail = GiftCard & {
  wishlists: Array<{ id: string; name: string }>;
};

/** A person as shown on the People index. */
export type PersonCard = PersonRef & { giftCount: number };

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
