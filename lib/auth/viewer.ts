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
 * handle: the catch-all route handler mounts it, and `currentViewer` below is
 * the only caller that reads it. Read a viewer from here instead.
 *
 * A `Viewer` is an identity and nothing more. What they may act on is not a
 * property of the person — it is a property of the row, and it lives in
 * `lib/db/authority.ts` (ADR-0002).
 */

import { redirect } from 'next/navigation';
import { auth } from '@/app/auth';

export type Viewer = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

/** The signed-in viewer, or `null`. Callers decide what to do about `null`. */
export async function currentViewer(): Promise<Viewer | null> {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) return null;

  return {
    id: user.id,
    name: user.name ?? null,
    email: user.email,
    image: user.image ?? null,
  };
}

/**
 * The signed-in viewer, or throw.
 *
 * Throws rather than redirecting so a server action can turn it into an error
 * result; `defineAction` does exactly that.
 */
export async function requireViewer(): Promise<Viewer> {
  const viewer = await currentViewer();
  if (!viewer) throw new Error('Unauthorized: you must be signed in');
  return viewer;
}

/** The signed-in viewer, or the login screen. The adapter pages use. */
export async function requireViewerOrRedirect(): Promise<Viewer> {
  const viewer = await currentViewer();
  if (!viewer) redirect('/login');
  return viewer;
}
