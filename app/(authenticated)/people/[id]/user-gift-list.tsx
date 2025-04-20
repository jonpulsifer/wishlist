'use client';

import { claimGift, deleteGift, unclaimGift } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { GiftWithOwnerAndClaimedByAndCreatedBy } from '@/lib/db/types';
import type { Gift } from '@/prisma/generated/client';
import { formatDistanceToNow } from 'date-fns';
import { startTransition } from 'react';
import { useOptimistic } from 'react';

interface UserGiftListProps {
  gifts: GiftWithOwnerAndClaimedByAndCreatedBy[];
  currentUserId: string;
}

export function UserGiftList({
  gifts: initialGifts,
  currentUserId,
}: UserGiftListProps) {
  const { toast } = useToast();
  const [gifts, setGifts] = useOptimistic(initialGifts);

  async function handleClaimToggle(gift: Gift) {
    try {
      startTransition(() => {
        setGifts((prev) =>
          prev.map((g) =>
            g.id === gift.id ? { ...g, claimed: !g.claimed } : g,
          ),
        );
      });

      const result = await (gift.claimed
        ? unclaimGift(gift.id)
        : claimGift(gift.id));

      if (result.success) {
        toast({
          title: 'Gift updated',
          description: result.message,
        });
      } else {
        startTransition(() => {
          setGifts((prev) =>
            prev.map((g) =>
              g.id === gift.id ? { ...g, claimed: !g.claimed } : g,
            ),
          );
        });
        toast({
          title: 'Failed to update gift',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
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

      if (!result.success) {
        startTransition(() => {
          setGifts(initialGifts);
        });
        toast({
          title: 'Failed to delete gift',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Failed to delete gift',
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="rounded-md border">
      <div className="hidden md:grid md:grid-cols-[1fr_200px_120px] gap-4 p-4 font-medium">
        <div>Gift</div>
        <div>Created</div>
        <div className="text-right">Actions</div>
      </div>

      {gifts.map((gift) => (
        <div
          key={gift.id}
          className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_200px_120px] gap-4 p-4 items-center border-t"
        >
          <div className="space-y-1">
            <div className="font-medium">{gift.name}</div>
            {gift.createdBy?.id !== gift.ownerId && (
              <div className="text-sm text-muted-foreground">
                Added by{' '}
                {gift.createdBy?.id === currentUserId
                  ? 'you'
                  : gift.createdBy?.name || gift.createdBy?.email}
              </div>
            )}
            <div className="md:hidden text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(gift.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>

          <div className="hidden md:block text-muted-foreground">
            {formatDistanceToNow(new Date(gift.createdAt), {
              addSuffix: true,
            })}
          </div>

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
      ))}
    </div>
  );
}
