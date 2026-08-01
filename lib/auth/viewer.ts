/**
 * Who is asking, and what may they do.
 *
 * One interface for every caller — pages, route handlers and server actions.
 * The same question used to be asked five different ways, and a page could admit
 * a role the actions it called would then reject.
 *
 * Three adapters sit at this seam, one per caller shape, because the only thing
 * that varies between them is what "no" looks like:
 *
 *   `currentViewer`            → `null`     (route handlers, which return 401)
 *   `requireViewer`            → throws     (server actions, via `defineAction`)
 *   `requireViewerOrRedirect`  → redirects  (pages)
 *
 * Nothing else may derive identity from the session. `auth()` is NextAuth's own
 * handle: the authenticated layout passes it to `SessionProvider` and the route
 * handler mounts it. Read a viewer from here instead — the session carries
 * capabilities, never role names, so "never name a role" holds by construction.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/app/auth';
import { type Capability, UnauthorizedError } from './capabilities';

export type Viewer = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  /** Capability check. Never ask about role names outside `./capabilities`. */
  can: (capability: Capability) => boolean;
  /** True when the viewer holds any capability at all — gates the admin nav. */
  isStaff: boolean;
};

/** The signed-in viewer, or `null`. Callers decide what to do about `null`. */
export async function currentViewer(): Promise<Viewer | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) return null;

  const granted = new Set(user.capabilities ?? []);

  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email,
    image: user.image ?? null,
    can: (capability: Capability) => granted.has(capability),
    isStaff: granted.size > 0,
  };
}

/**
 * The signed-in viewer, or throw.
 *
 * Throws rather than redirecting so a server action can turn it into an error
 * result; `defineAction` does exactly that.
 */
export async function requireViewer(capability?: Capability): Promise<Viewer> {
  const viewer = await currentViewer();
  if (!viewer) throw new UnauthorizedError();
  if (capability && !viewer.can(capability)) {
    throw new UnauthorizedError(capability);
  }
  return viewer;
}

/**
 * The signed-in viewer, or navigate away. The adapter pages use.
 *
 * Signed out goes to the login screen; signed in but short a capability goes
 * home, because telling someone which screens exist that they cannot open is
 * itself a disclosure.
 */
export async function requireViewerOrRedirect(
  capability?: Capability,
): Promise<Viewer> {
  const viewer = await currentViewer();
  if (!viewer) redirect('/login');
  if (capability && !viewer.can(capability)) redirect('/');
  return viewer;
}
