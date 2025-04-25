import { getSession } from '@/app/auth';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { getGiftWithAccessCheck } from '@/lib/db/queries-cached';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/gifts">Gifts</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{gift.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
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
