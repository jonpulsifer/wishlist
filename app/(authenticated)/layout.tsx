// import { getPeopleForNewGiftModal } from 'lib/db/queries-cached';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/app/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { Loading } from '@/components/ui/loading';
import { SidebarProvider } from '@/components/ui/sidebar';

async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) return <Loading message="Authenticating..." />;
  // const people = await getPeopleForNewGiftModal(session.user.id);
  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 relative z-10 bg-background/20 backdrop-blur-sm">
          {children}
        </main>
      </SidebarProvider>
    </SessionProvider>
  );
}
export default Layout;
