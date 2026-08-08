/**
 * The optimistic bounce for signed-out visitors.
 *
 * Under Cache Components a page's shell is committed at 200 before any runtime
 * read resolves, so a `redirect()` from inside a Suspense hole degrades to a
 * client-side meta redirect. This runs before the render and can still emit a
 * real 307.
 *
 * It reads the cookie's presence and nothing else — it does not verify the
 * session. `requireViewerOrRedirect()` in each page remains the true guard.
 */

import { type NextRequest, NextResponse } from 'next/server';

/**
 * Matches `authjs.session-token`, its `__Secure-` production form, and the
 * chunked `.0`/`.1` variants Auth.js writes when a session outgrows one cookie.
 */
const SESSION_COOKIE = 'authjs.session-token';

export function proxy(request: NextRequest) {
  const signedIn = request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes(SESSION_COOKIE));

  // The landing page bounces the other way: signed-in visitors go straight to
  // /home with a real 307, which its own Suspense boundary can no longer emit.
  if (request.nextUrl.pathname === '/') {
    return signedIn
      ? NextResponse.redirect(new URL('/home', request.nextUrl))
      : NextResponse.next();
  }

  return signedIn
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/', request.nextUrl));
}

export const config = {
  matcher: [
    '/',
    '/home',
    '/people/:path*',
    '/gifts/:path*',
    '/claimed',
    '/ai',
    '/secret-santa/:path*',
    '/families',
    '/plinko',
  ],
};
