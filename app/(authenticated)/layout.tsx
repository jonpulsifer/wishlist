import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/app/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { GlobalSearchProvider } from '@/components/global-search/global-search-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import {
  getClaimedGiftsForMe,
  getUsersForPeoplePage,
} from '@/lib/db/queries-cached';
import { shoppingProgress } from '@/lib/shopping-progress';

async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/');

  const [people, claimedByMe] = await Promise.all([
    getUsersForPeoplePage(session.user.id),
    getClaimedGiftsForMe(session.user.id),
  ]);
  const { sortedPeople, total, percent } = shoppingProgress(
    people,
    claimedByMe,
  );

  return (
    <SessionProvider session={session}>
      <GlobalSearchProvider>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar
            progress={{ sorted: sortedPeople.length, total, percent }}
          />
          <main className="flex flex-1">{children}</main>
        </SidebarProvider>
      </GlobalSearchProvider>
    </SessionProvider>
  );
}
export default Layout;
