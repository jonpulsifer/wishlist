import Link from 'next/link';
import { PageContainer } from '@/components/shell/page-container';
import { PageTransition } from '@/components/shell/page-transition';
import { Button } from '@/components/ui/button';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getClaimedWishesForMe } from '@/lib/db/queries-cached';
import GiftList from './gift-list';

export default async function ClaimedPage() {
  const viewer = await requireViewerOrRedirect();
  const claimedGifts = await getClaimedWishesForMe(viewer.id);

  return (
    <PageTransition>
      <PageContainer className="overflow-hidden">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Claimed Gifts
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            These are the gifts you have claimed from other people's wishlists.
          </p>
        </div>

        {claimedGifts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-12 text-center">
            <span aria-hidden className="text-5xl">
              🎁
            </span>
            <p className="text-lg text-muted-foreground">
              You haven't claimed any gifts yet.
            </p>
            <Button asChild className="min-h-11">
              <Link href="/gifts">Browse Gifts</Link>
            </Button>
          </div>
        ) : (
          <GiftList gifts={claimedGifts} />
        )}
      </PageContainer>
    </PageTransition>
  );
}
