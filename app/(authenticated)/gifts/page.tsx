import { User } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { AddGiftDialog } from '@/components/add-gift-dialog';
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
import { Skeleton } from '@/components/ui/skeleton';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import {
  getPeopleForNewWishModal,
  getSortedVisibleWishesForUser,
} from '@/lib/db/queries-cached';
import { GiftList } from './gift-list';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GiftsPage({ searchParams }: PageProps) {
  // Pass the initial search params to the client component
  const { q, sort, direction } = await searchParams;
  const viewer = await requireViewerOrRedirect();

  const gifts = await getSortedVisibleWishesForUser({
    userId: viewer.id,
    direction: direction as 'asc' | 'desc',
    column: sort as 'name' | 'owner',
  });

  const users = await getPeopleForNewWishModal(viewer.id);

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Gifts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Gifts</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              The gifts in this list include: Claimable gifts, Gifts that you
              have created, and Gifts that you have already claimed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild variant="outline">
              <Link href="/people/me">
                <User className="h-4 w-4 mr-2" />
                View My Gifts
              </Link>
            </Button>
            <AddGiftDialog users={users} currentUserId={viewer.id} />
          </div>
        </div>
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <GiftList
            initialGifts={gifts}
            search={q as string}
            sort={sort as 'name' | 'owner'}
            direction={direction as 'asc' | 'desc'}
            currentUserId={viewer.id}
          />
        </Suspense>
      </AppContent>
    </SidebarInset>
  );
}
