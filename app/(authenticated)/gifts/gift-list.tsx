'use client';

import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useMemo, useOptimistic } from 'react';
import { claimGift, deleteGift, unclaimGift } from '@/app/_actions/gifts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { useToast } from '@/hooks/use-toast';
import type { GiftWithOwnerAndClaimedByAndCreatedBy } from '@/lib/db/types';
import { getInitials } from '@/lib/utils';
import type { Gift } from '@/prisma/generated/client';

interface GiftListProps {
  initialGifts: GiftWithOwnerAndClaimedByAndCreatedBy[];
  search: string;
  sort: string;
  direction: string;
  currentUserId: string;
}

export function GiftList({
  initialGifts,
  search,
  sort,
  direction,
  currentUserId,
}: GiftListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [gifts, setGifts] = useOptimistic(initialGifts);

  const updateParams = (params: {
    q?: string;
    sort?: string;
    direction?: string;
  }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    }
    router.push(`?${newParams.toString()}`);
  };

  const debouncedUpdateParams = useDebounce((value: string) => {
    updateParams({ q: value });
  }, 300);

  const filteredAndSortedGifts = useMemo(() => {
    if (!search) {
      return gifts;
    }
    return gifts
      .filter(
        (gift) =>
          gift.name.toLowerCase().includes(search.toLowerCase()) ||
          gift.owner.name?.toLowerCase().includes(search.toLowerCase()) ||
          gift.url?.toLowerCase().includes(search.toLowerCase()) ||
          gift.description?.toLowerCase().includes(search.toLowerCase()) ||
          false,
      )
      .sort((a, b) => {
        switch (sort) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'owner':
            return (a.owner.name ?? '').localeCompare(b.owner.name ?? '');
          default:
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      });
  }, [gifts, search, sort, direction]);

  async function handleClaimToggle(gift: Gift) {
    try {
      // Optimistically update the UI
      startTransition(() => {
        setGifts((prev) =>
          prev.map((g) =>
            g.id === gift.id ? { ...g, claimed: !g.claimed } : g,
          ),
        );
      });

      // Perform the server action
      const result = await (gift.claimed
        ? unclaimGift(gift.id)
        : claimGift(gift.id));

      if (result.success) {
        toast({
          title: 'Gift updated',
          description: result.message,
        });
      } else {
        // Revert on failure
        startTransition(() => {
          setGifts((prev) =>
            prev.map((g) =>
              g.id === gift.id ? { ...g, claimed: !g.claimed } : g,
            ),
          );
        });
        toast({
          title: 'Failed to update gift',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (_error) {
      toast({
        title: 'An error occurred',
        description: 'Failed to update gift',
        variant: 'destructive',
      });
    }
  }

  async function handleDelete(giftId: string) {
    try {
      startTransition(() => {
        setGifts((prev) => prev.filter((g) => g.id !== giftId));
      });

      const result = await deleteGift(giftId);

      if (result.success) {
        toast({
          title: 'Gift deleted',
          description: result.message,
        });
      } else {
        // Revert on failure
        startTransition(() => {
          setGifts(gifts);
        });
        toast({
          title: 'Failed to delete gift',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (_error) {
      toast({
        title: 'An error occurred',
        description: 'Failed to delete gift',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search gifts..."
            defaultValue={search}
            onChange={(e) => debouncedUpdateParams(e.target.value)}
            className="w-full"
          />
        </div>
        <Select
          value={sort}
          onValueChange={(value) => updateParams({ sort: value })}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by date</SelectItem>
            <SelectItem value="name">Sort by name (A-Z)</SelectItem>
            <SelectItem value="owner">Sort by recipient</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        {filteredAndSortedGifts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-lg font-semibold mb-2">
              {search ? 'No gifts found' : 'No gifts yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {search
                ? `No gifts match "${search}". Try adjusting your search.`
                : 'Start adding gifts to your wishlist or ask others to add some for you!'}
            </p>
            {!search && (
              <Button asChild>
                <Link href="/people/me">View My Profile</Link>
              </Button>
            )}
          </div>
        ) : (
          filteredAndSortedGifts.map((gift) => (
            <div
              key={gift.id}
              className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_150px_auto] gap-4 p-4 items-center border-t"
            >
              <Link
                href={`/gifts/${gift.id}`}
                className="space-y-1 hover:opacity-80"
              >
                <div className="font-medium">{gift.name}</div>
                {gift.createdBy?.id !== gift.owner.id && (
                  <div className="text-sm text-muted-foreground">
                    Added by{' '}
                    {gift.createdBy?.id === currentUserId
                      ? 'you'
                      : gift.createdBy?.name ||
                        gift.createdBy?.email ||
                        'someone else'}
                  </div>
                )}
                <div className="md:hidden text-sm text-muted-foreground flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={gift.owner?.image || undefined} />
                    <AvatarFallback>{getInitials(gift.owner)}</AvatarFallback>
                  </Avatar>
                  <span>{gift.owner?.name}</span>•{' '}
                  {formatDistanceToNow(new Date(gift.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </Link>

              <Link
                href={`/people/${gift.owner.id}`}
                className="hidden md:flex items-center gap-2 hover:opacity-80"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={gift.owner.image ?? undefined} />
                  <AvatarFallback>{getInitials(gift.owner)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span>
                    {gift.owner.id === currentUserId ? 'you' : gift.owner.name}
                  </span>
                  <span className="text-muted-foreground text-xxs">
                    {formatDistanceToNow(new Date(gift.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </Link>

              <div className="text-right">
                {gift.createdBy?.id === currentUserId ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(gift.id)}
                    size="sm"
                    className="w-20 md:w-24"
                  >
                    Delete
                  </Button>
                ) : (
                  <Button
                    variant={gift.claimed ? 'destructive' : 'default'}
                    onClick={() => handleClaimToggle(gift)}
                    size="sm"
                    className="w-20 md:w-24"
                  >
                    {gift.claimed ? 'Unclaim' : 'Claim'}
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
