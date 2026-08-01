/**
 * Who is asking, and what may they do.
 *
 * One interface for every caller — pages, route handlers and server actions.
 * Previously the same question was asked five different ways, and a page could
 * admit a role the actions it called would then reject.
 */

import { auth } from '@/app/auth';
import { type Capability, capabilitiesFor } from './capabilities';

export type Viewer = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  /** Capability check. Never ask about role names outside this module. */
  can: (capability: Capability) => boolean;
  /** True when the viewer holds any capability at all — gates the admin nav. */
  isStaff: boolean;
};

/** The signed-in viewer, or `null`. Callers decide what to do about `null`. */
export async function currentViewer(): Promise<Viewer | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) return null;

  const roleNames = (user.roles ?? []).map((r) => r.role.name);
  const granted = capabilitiesFor(roleNames);

  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email,
    image: user.image ?? null,
    can: (capability: Capability) => granted.has(capability),
    isStaff: granted.size > 0,
  };
}

export class UnauthorizedError extends Error {
  constructor(readonly capability?: Capability) {
    super(
      capability
        ? `Unauthorized: this action requires ${capability}`
        : 'Unauthorized: you must be signed in',
    );
    this.name = 'UnauthorizedError';
  }
}

/**
 * The signed-in viewer, or throw.
 *
 * Throws rather than redirecting so the caller chooses the response: a page
 * redirects, a route handler returns 401, an action returns an error result.
 */
export async function requireViewer(capability?: Capability): Promise<Viewer> {
  const viewer = await currentViewer();
  if (!viewer) throw new UnauthorizedError();
  if (capability && !viewer.can(capability)) {
    throw new UnauthorizedError(capability);
  }
  return viewer;
}
