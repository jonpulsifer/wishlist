/**
 * NextAuth wiring, and nothing else.
 *
 * `auth()` is exported for the two places that genuinely need a `Session`: the
 * catch-all route handler and the `SessionProvider` in the authenticated layout.
 * Everything that wants to know *who is asking* goes through `lib/auth/viewer`.
 *
 * The session callback resolves roles into capabilities here, on the server, so
 * role names never reach the browser and no caller can gate on one.
 */

import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { type DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
import { type Capability, capabilitiesFor } from '@/lib/auth/capabilities';
import prisma from '@/lib/db/client';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async session({ session, user }) {
      // Select, don't include: the previous version assigned the whole `User`
      // row — shipping address, sizes, onboarding flags — onto the session, and
      // `SessionProvider` serialises that straight into the page source.
      const record = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          // Required by the NextAuth adapter's user shape.
          emailVerified: true,
          roles: { select: { role: { select: { name: true } } } },
        },
      });

      if (record) {
        const { roles, ...person } = record;
        session.user = {
          ...person,
          capabilities: [...capabilitiesFor(roles.map((r) => r.role.name))],
        };
      }
      return session;
    },
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
});

/**
 * What the browser is allowed to know about the signed-in person.
 *
 * Capabilities, not roles: the sidebar needs to decide whether to draw the admin
 * link, and that is the only authorization question a client may ask.
 */
type SessionUser = {
  id: string;
  image: string | null;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  capabilities: Capability[];
};

declare module 'next-auth' {
  /**
   * Returned by `useSession` and received as a prop on the `SessionProvider`
   * React Context.
   */
  interface Session {
    user: SessionUser & DefaultSession['user'];
  }
}
