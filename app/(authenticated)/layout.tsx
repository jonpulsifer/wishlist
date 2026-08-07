import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/app/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { GlobalSearchProvider } from '@/components/global-search/global-search-provider';
import { PwaShellPrototype } from '@/components/prototype/pwa-shell-prototype';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  getClaimedWishesForMe,
  getUsersForPeoplePage,
} from '@/lib/db/queries-cached';
import { shoppingProgress } from '@/lib/shopping-progress';

async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/');

  const [people, claimedByMe] = await Promise.all([
    getUsersForPeoplePage(session.user.id),
    getClaimedWishesForMe(session.user.id),
  ]);
  const { sortedPeople, total, percent } = shoppingProgress(
    people,
    claimedByMe,
  );

  return (
    <SessionProvider session={session}>
      <GlobalSearchProvider>
        <SidebarProvider defaultOpen={false}>
          {/* PROTOTYPE — shell variants, see components/prototype/. */}
          <PwaShellPrototype
            sidebar={
              <AppSidebar
                progress={{ sorted: sortedPeople.length, total, percent }}
              />
            }
          >
            {children}
          </PwaShellPrototype>
        </SidebarProvider>
      </GlobalSearchProvider>
    </SessionProvider>
  );
}
export default Layout;
