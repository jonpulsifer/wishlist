import { Suspense } from 'react';
import { AppHeader } from '@/components/app-header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { SidebarInset } from '@/components/ui/sidebar';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getFamiliesWithMembers } from '@/lib/db/queries-cached';
import { WishlistCard } from './wishlist-card';

export default async function WishlistsPage() {
  const viewer = await requireViewerOrRedirect();

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Wishlists</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-2 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Wishlists</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              The wishlists you belong to, and who else is in them.
            </p>
          </div>
        </div>

        <Suspense fallback={<WishlistsLoading />}>
          <WishlistsContent userId={viewer.id} />
        </Suspense>
      </div>
    </SidebarInset>
  );
}

function WishlistsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <div className="h-7 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          <div className="h-20 bg-muted/50 rounded animate-pulse mt-4" />
          <div className="h-10 bg-muted rounded animate-pulse mt-4" />
        </div>
      ))}
    </div>
  );
}

async function WishlistsContent({ userId }: { userId: string }) {
  const wishlists = await getFamiliesWithMembers(userId);

  if (wishlists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          You are not in any wishlists yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {wishlists.map((wishlist) => (
        <WishlistCard key={wishlist.id} wishlist={wishlist} />
      ))}
    </div>
  );
}
