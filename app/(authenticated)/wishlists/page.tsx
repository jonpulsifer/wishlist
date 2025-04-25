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
import { WishlistCard } from './wishlist-card';

export default async function WishlistsPage() {
  const { user } = await getSession();
  const wishlists = await getWishlistsWithMembers();

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

        {wishlists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              There are no wishlists yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wishlists.map((wishlist) => {
              const isMember = wishlist.members.some(
                (member) => member.id === user.id,
              );
              return (
                <WishlistCard
                  key={wishlist.id}
                  wishlist={wishlist}
                  isMember={isMember}
                />
              );
            })}
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
