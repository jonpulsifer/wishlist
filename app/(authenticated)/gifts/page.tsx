import { User } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { PageContainer } from '@/components/shell/page-container';
import { PageTransition } from '@/components/shell/page-transition';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getSortedVisibleWishesForUser } from '@/lib/db/queries-cached';
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

  return (
    <PageTransition>
      <PageContainer className="overflow-hidden">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Gifts</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            The gifts in this list include: Claimable gifts, Gifts that you have
            created, and Gifts that you have already claimed.
          </p>
          <Button
            asChild
            variant="outline"
            className="min-h-11 w-full sm:w-fit"
          >
            <Link href="/people/me">
              <User />
              View My Gifts
            </Link>
          </Button>
        </div>
        <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
          <GiftList
            initialGifts={gifts}
            search={q as string}
            sort={sort as 'name' | 'owner'}
            direction={direction as 'asc' | 'desc'}
            currentUserId={viewer.id}
          />
        </Suspense>
      </PageContainer>
    </PageTransition>
  );
}
