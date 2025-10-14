import { redirect } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/app/auth';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/');
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
