import Link from 'next/link';
import { getSession } from '@/app/auth';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

import { getClaimedGiftsForMe } from '@/lib/db/queries-cached';
import GiftList from './gift-list';

export default async function ClaimedPage() {
  const { user } = await getSession();
  const claimedGifts = await getClaimedGiftsForMe(user.id);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Claimed Gifts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
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
      </div>
    </SidebarInset>
  );
}
