import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/shell/page-container';
import { PageHeader } from '@/components/shell/page-header';
import { PageTransition } from '@/components/shell/page-transition';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getWishWithAccessCheck } from '@/lib/db/queries-cached';
import { GiftDetail } from './gift-detail';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const viewer = await requireViewerOrRedirect();
  const { id } = await params;
  const gift = await getWishWithAccessCheck(id, viewer.id);

  if (!gift) {
    return {
      title: 'Gift Not Found',
    };
  }

  return {
    title: `${gift.name} | Wishlist`,
  };
}

export default async function GiftPage({ params }: Props) {
  const viewer = await requireViewerOrRedirect();
  const { id } = await params;
  const gift = await getWishWithAccessCheck(id, viewer.id);

  if (!gift) {
    notFound();
  }

  return (
    <PageTransition>
      <PageContainer className="overflow-hidden">
        <PageHeader title={gift.name} backHref="/gifts" backLabel="Gifts" />
        <GiftDetail
          gift={gift}
          currentUserId={viewer.id}
          canEdit={gift.canEdit}
        />
      </PageContainer>
    </PageTransition>
  );
}
