import Link from 'next/link';
import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { SidebarInset } from '@/components/ui/sidebar';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getClaimedGiftsForMe } from '@/lib/db/queries-cached';
import GiftList from './gift-list';

export default async function ClaimedPage() {
  const viewer = await requireViewerOrRedirect();
  const claimedGifts = await getClaimedGiftsForMe(viewer.id);

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Claimed Gifts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Claimed Gifts</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            These are the gifts you have claimed from other people's wishlists.
          </p>
        </div>

        {claimedGifts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              You haven't claimed any gifts yet.
            </p>
            <Button asChild className="mt-4">
              <Link href="/gifts">Browse Gifts</Link>
            </Button>
          </div>
        ) : (
          <GiftList gifts={claimedGifts} />
        )}
      </AppContent>
    </SidebarInset>
  );
}
