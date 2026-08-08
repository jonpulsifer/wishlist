import { Suspense } from 'react';
import { GlobalSearchProvider } from '@/components/global-search/global-search-provider';
import { AppShell } from '@/components/shell/app-shell';
import { ShellFab } from '@/components/shell/shell-fab';
import { ShellUser } from '@/components/shell/shell-user';
import { UserMenuSkeleton } from '@/components/shell/user-menu';

/**
 * The chrome, and nothing that has to be awaited.
 *
 * Under Cache Components a layout that reads runtime data outside a boundary
 * costs every route below it its prerendered shell, so the two pieces that need
 * a viewer arrive as Suspense holes. `proxy.ts` bounces signed-out visitors and
 * each page's `requireViewerOrRedirect()` is the guard.
 */
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalSearchProvider>
      <AppShell
        user={
          <Suspense fallback={<UserMenuSkeleton />}>
            <ShellUser />
          </Suspense>
        }
        fab={
          <Suspense fallback={null}>
            <ShellFab />
          </Suspense>
        }
      >
        {children}
      </AppShell>
    </GlobalSearchProvider>
  );
}
export default Layout;
