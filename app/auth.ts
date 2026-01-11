import { PrismaAdapter } from '@auth/prisma-adapter';
import { redirect } from 'next/navigation';
import NextAuth, { type DefaultSession } from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaClient } from '@/prisma/generated/client';

const prisma = new PrismaClient();

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

export const isGodmode = (user: SessionUser) => {
  return (
    user.roles.some((userRole) => userRole.role.name === 'godmode') || false
  );
};

export const isSecretSantaAdmin = (user: SessionUser) => {
  return (
    user.roles.some(
      (userRole) => userRole.role.name === 'secret-santa-manager',
    ) || false
  );
};

export const isWishlistAdmin = (user: SessionUser) => {
  return (
    isGodmode(user) ||
    user.roles.some((userRole) => userRole.role.name === 'wishlist-manager') ||
    false
  );
};

export const hasRole = (user: SessionUser, roleName: string) => {
  return (
    user.roles.some((userRole) => userRole.role.name === roleName) || false
  );
};
