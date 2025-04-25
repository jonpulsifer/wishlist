import { getSession } from '@/app/auth';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { getWishlistsWithMembers } from '@/lib/db/queries-cached';
import { Suspense } from 'react';
import { WishlistCard } from './wishlist-card';

export default async function WishlistsPage() {
  const { user } = await getSession();

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Wishlists</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Wishlists</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Browse and join wishlists to see what gifts people want.
            </p>
          </div>
        </div>

        <Suspense fallback={<WishlistsLoading />}>
          <WishlistsContent userId={user.id} />
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
  const wishlists = await getWishlistsWithMembers();

  if (wishlists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          There are no wishlists yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {wishlists.map((wishlist) => {
        // Determine if the current user is a member of this wishlist
        const isMember = wishlist.members.some(
          (member) => member.id === userId,
        );

        if (!isMember) {
          wishlist.members = [];
        }

        return (
          <WishlistCard
            key={wishlist.id}
            wishlist={wishlist}
            isMember={isMember}
          />
        );
      })}
    </div>
  );
}
