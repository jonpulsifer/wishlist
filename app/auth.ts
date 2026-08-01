import { PrismaAdapter } from '@auth/prisma-adapter';
import { redirect } from 'next/navigation';
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
      const userWithRoles = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      session.user = userWithRoles as SessionUser;
      return session;
    },
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
});

type SessionUser = {
  id: string;
  image: string | null;
  name: string | null;
  email: string;
  roles: Array<{ role: { name: string } }>;
  emailVerified: Date | null;
};

export const getSession = async () => {
  const session = await auth();
  if (!session || !session.user) {
    console.error(
      'could not get session or user from session, redirecting to login',
    );
    return redirect('/login');
  }
  return session;
};

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: SessionUser & DefaultSession['user'];
  }
}
