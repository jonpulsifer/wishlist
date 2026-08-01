import { redirect } from 'next/navigation';
import { getAllWishlistsAdmin } from '@/app/_actions/admin-wishlists';
import { AppHeader } from '@/components/app-header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset } from '@/components/ui/sidebar';
import { currentViewer } from '@/lib/auth/viewer';
import { WishlistManager } from './wishlist-manager';

export default async function AdminWishlistsPage() {
  const viewer = await currentViewer();
  if (!viewer?.can('manage:wishlists')) {
    redirect('/');
  }

  const wishlistsResult = await getAllWishlistsAdmin();
  if (!wishlistsResult.success) {
    return (
      <SidebarInset>
        <AppHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Wishlists</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AppHeader>
        <div className="flex flex-1 flex-col gap-6 p-4 max-w-full overflow-hidden">
          <p className="text-destructive">Error: {wishlistsResult.error}</p>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Wishlists</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col gap-6 p-4 max-w-full overflow-hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Wishlist Management
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Create and delete wishlists, and rotate their 4-digit pins.
          </p>
        </div>

        <WishlistManager wishlists={wishlistsResult.wishlists} />
      </div>
    </SidebarInset>
  );
}
