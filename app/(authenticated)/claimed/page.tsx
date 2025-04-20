import { getSession } from '@/app/auth';
import db from '@/lib/db/client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { unclaimGift } from '@/app/actions';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

interface Gift {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  createdAt: Date;
  updatedAt: Date;
  image: string | null;
  published: boolean;
  ownerId: string;
  claimed: boolean;
  claimedById: string | null;
  createdById: string | null;
  owner: {
    name: string | null;
  };
}

async function handleUnclaim(formData: FormData) {
  const giftId = formData.get('giftId');
  if (typeof giftId !== 'string') {
    throw new Error('Gift ID is required');
  }
  const result = await unclaimGift(giftId);
  if (result.error) {
    toast({
      title: 'Error',
      description: result.error,
    });
  } else {
    toast({
      title: 'Success',
      description: result.message,
    });
  }
}

export default async function ClaimedPage() {
  const { user } = await getSession();

  const claimedGifts = await db.gift.findMany({
    where: {
      claimedById: user.id,
    },
    include: {
      owner: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

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
          <div className="rounded-md border">
            <div className="hidden md:grid md:grid-cols-[1fr_200px_120px] gap-4 p-4 font-medium">
              <div>Gift</div>
              <div>Recipient</div>
              <div className="text-right">Actions</div>
            </div>
            {claimedGifts.map((gift: Gift) => (
              <div
                key={gift.id}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_200px_120px] gap-4 p-4 items-center border-t"
              >
                <div className="space-y-1">
                  <div className="font-medium">{gift.name}</div>
                  {gift.description && (
                    <div className="text-sm text-muted-foreground">
                      {gift.description}
                    </div>
                  )}
                  {gift.url && (
                    <a
                      href={gift.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      View Link
                    </a>
                  )}
                </div>
                <div className="text-muted-foreground">
                  {gift.owner.name || 'Unknown'}
                </div>
                <div className="text-right">
                  <form action={handleUnclaim}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-20 md:w-24"
                    >
                      Unclaim
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
