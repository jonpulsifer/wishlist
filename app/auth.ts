/**
 * NextAuth wiring, and nothing else.
 *
 * `auth()` is exported for the one place that genuinely needs a `Session`: the
 * catch-all route handler. Everything that wants to know *who is asking* goes
 * through `lib/auth/viewer`.
 *
 * The session callback selects the few fields the browser is allowed to know
 * about the signed-in person, and nothing else: there is no authorization
 * question a client may ask (ADR-0002).
 */

import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth, { type DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
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
      // row — shipping address, sizes, onboarding flags — onto the session,
      // which is exactly what the browser may learn about the viewer.
      const record = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          // Required by the NextAuth adapter's user shape.
          emailVerified: true,
        },
      });

      if (record) session.user = record;
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
 * Identity and nothing more. What they may act on is a property of the row, not
 * of the person, so there is nothing here for a client to gate on.
 */
type SessionUser = {
  id: string;
  image: string | null;
  name: string | null;
  email: string;
  emailVerified: Date | null;
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
