import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/app/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { GlobalSearchProvider } from '@/components/global-search/global-search-provider';
import { SidebarProvider } from '@/components/ui/sidebar';

async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/');
  return (
    <SessionProvider session={session}>
      <GlobalSearchProvider>
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <main className="flex flex-1">{children}</main>
        </SidebarProvider>
      </GlobalSearchProvider>
    </SessionProvider>
  );
}
export default Layout;
