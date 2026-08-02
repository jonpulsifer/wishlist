/**
 * The reads behind the admin screens.
 *
 * These used to be built with `defineAction`, which made each of them a
 * POST-able RPC endpoint returning every role, wishlist or user in the install,
 * and forced the pages that called them to narrow on `result.success` and
 * hand-render a second copy of the page chrome for the failure branch.
 *
 * They are queries now. Each takes the `Viewer` the page already resolved and
 * asserts the capability it needs, so the gate travels with the query rather
 * than being restated by every caller. A page that forgets to gate cannot call
 * these — it has no `Viewer` to pass.
 *
 * Nothing here is cached: these screens exist to show the current state of the
 * install, and a stale role list is worse than a slow one.
 */

import {
  BUILT_IN_ROLES,
  type Capability,
  UnauthorizedError,
} from '@/lib/auth/capabilities';
import type { Viewer } from '@/lib/auth/viewer';
import db from './client';

/** A person as named on an admin screen. */
const adminPersonSelect = { id: true, name: true, email: true } as const;

function assert(viewer: Viewer, capability: Capability): void {
  if (!viewer.can(capability)) throw new UnauthorizedError(capability);
}

/**
 * Create the `Role` rows the capability table knows about.
 *
 * This is a write, and it is named like one. It used to run inside `getAllRoles`
 * on every render of the admin roles screen, which meant a page load performed
 * three upserts and the read could not be reasoned about as a read.
 */
export async function ensureBuiltInRoles(viewer: Viewer): Promise<void> {
  assert(viewer, 'manage:roles');
  await db.$transaction(
    BUILT_IN_ROLES.map((name) =>
      db.role.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );
}

export async function getAllRoles(viewer: Viewer) {
  assert(viewer, 'manage:roles');
  return db.role.findMany({
    select: {
      id: true,
      name: true,
      users: { select: { id: true, user: { select: adminPersonSelect } } },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getAllUsersForRoles(viewer: Viewer) {
  assert(viewer, 'manage:roles');
  return db.user.findMany({
    select: {
      ...adminPersonSelect,
      roles: {
        select: { id: true, role: { select: { id: true, name: true } } },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getAllWishlists(viewer: Viewer) {
  assert(viewer, 'manage:wishlists');
  return db.wishlist.findMany({
    select: {
      id: true,
      name: true,
      _count: { select: { members: true, gifts: true } },
    },
    orderBy: { name: 'asc' },
  });
}

export async function getAllSecretSantaEvents(viewer: Viewer) {
  assert(viewer, 'manage:secret-santa');
  return db.secretSantaEvent.findMany({
    select: {
      id: true,
      name: true,
      year: true,
      createdAt: true,
      createdBy: { select: adminPersonSelect },
      participants: {
        select: {
          id: true,
          user: { select: adminPersonSelect },
          assignedTo: { select: adminPersonSelect },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/** Every person in the install, for the exclusion and role pickers. */
export async function getAllPeople(
  viewer: Viewer,
  capability: Capability,
): Promise<Array<{ id: string; name: string | null; email: string }>> {
  assert(viewer, capability);
  return db.user.findMany({
    select: adminPersonSelect,
    orderBy: { name: 'asc' },
  });
}

export type ExclusionPairRow = {
  user1: { id: string; name: string | null; email: string };
  user2: { id: string; name: string | null; email: string };
};

/**
 * Exclusion pairs, collapsed to one row per pair.
 *
 * The relation is stored in both directions so the draw sees the pair whichever
 * side it reads; this folds it back to one row for display.
 */
export async function getSecretSantaExclusions(
  viewer: Viewer,
): Promise<ExclusionPairRow[]> {
  assert(viewer, 'manage:secret-santa');

  const people = await db.user.findMany({
    where: { secretSantaDoNotMatchWith: { some: {} } },
    select: {
      ...adminPersonSelect,
      secretSantaDoNotMatchWith: { select: adminPersonSelect },
    },
    orderBy: { name: 'asc' },
  });

  const seen = new Set<string>();
  const pairs: ExclusionPairRow[] = [];

  for (const person of people) {
    for (const other of person.secretSantaDoNotMatchWith) {
      const key = [person.id, other.id].sort().join('-');
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push({
        user1: { id: person.id, name: person.name, email: person.email },
        user2: { id: other.id, name: other.name, email: other.email },
      });
    }
  }

  return pairs;
}
