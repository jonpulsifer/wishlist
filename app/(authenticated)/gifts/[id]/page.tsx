import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSession } from '@/app/auth';
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
import { getGiftWithAccessCheck } from '@/lib/db/queries-cached';
import { GiftDetail } from './gift-detail';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { user } = await getSession();
  const { id } = await params;
  const gift = await getGiftWithAccessCheck(id, user.id);

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
  const { user } = await getSession();
  const { id } = await params;
  const gift = await getGiftWithAccessCheck(id, user.id);

  if (!gift) {
    notFound();
  }

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/gifts">Gifts</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[150px] sm:max-w-none truncate">
                {gift.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 max-w-full overflow-hidden">
        <div className="container mx-auto py-6">
          <GiftDetail
            gift={gift}
            currentUserId={user.id}
            canEdit={gift.canEdit}
          />
        </div>
      </div>
    </SidebarInset>
  );
}
