'use client';

import { formatDistanceToNow } from 'date-fns';
import { Archive, ArchiveRestore, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { startTransition, useOptimistic, useState } from 'react';
import {
  archiveGift,
  claimGift,
  deleteGift,
  unarchiveGift,
  unclaimGift,
} from '@/app/_actions/gifts';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { GiftWithOwnerAndClaimedByAndCreatedBy } from '@/lib/db/types';
import type { Gift } from '@/prisma/generated/client';

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
  const [showArchived, setShowArchived] = useState(false);

  const activeGifts = gifts.filter((g) => !g.archived);
  // Only show archived gifts to the owner
  const archivedGifts = gifts.filter(
    (g) => g.archived && g.ownerId === currentUserId,
  );

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
    } catch (_error) {
      toast({
        title: 'An error occurred',
        description: 'Failed to delete gift',
        variant: 'destructive',
      });
    }
  }

  async function handleArchiveToggle(gift: Gift) {
    try {
      startTransition(() => {
        setGifts((prev) =>
          prev.map((g) =>
            g.id === gift.id ? { ...g, archived: !g.archived } : g,
          ),
        );
      });

      const result = await (gift.archived
        ? unarchiveGift(gift.id)
        : archiveGift(gift.id));

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
      } else {
        startTransition(() => {
          setGifts((prev) =>
            prev.map((g) =>
              g.id === gift.id ? { ...g, archived: !g.archived } : g,
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
        description: 'Failed to archive gift',
        variant: 'destructive',
      });
    }
  }

  const renderGiftRow = (gift: GiftWithOwnerAndClaimedByAndCreatedBy) => {
    const isOwner = gift.ownerId === currentUserId;

    return (
      <div
        key={gift.id}
        className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_200px_200px] gap-4 p-4 items-center border-t"
      >
        <div className="space-y-1">
          {isOwner ? (
            <Link
              href={`/gifts/${gift.id}`}
              className="font-medium hover:text-primary transition-colors hover:underline"
            >
              {gift.name}
            </Link>
          ) : (
            <div className="font-medium">{gift.name}</div>
          )}
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

        <div className="flex gap-2 justify-end">
          {isOwner ? (
            <>
              <Button
                variant="outline"
                onClick={() => handleArchiveToggle(gift)}
                size="sm"
                title={gift.archived ? 'Unarchive' : 'Archive'}
              >
                {gift.archived ? (
                  <ArchiveRestore className="h-4 w-4" />
                ) : (
                  <Archive className="h-4 w-4" />
                )}
              </Button>
              {gift.createdBy?.id === currentUserId && (
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(gift.id)}
                  size="sm"
                >
                  Delete
                </Button>
              )}
            </>
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
    );
  };

  return (
    <>
      <div className="hidden md:grid md:grid-cols-[1fr_200px_200px] gap-4 p-4 font-medium">
        <div>Gift</div>
        <div>Created</div>
        <div className="text-right">Actions</div>
      </div>

      {activeGifts.map(renderGiftRow)}

      {archivedGifts.length > 0 && (
        <>
          <div className="border-t mt-4">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className="w-full p-4 flex items-center justify-between hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Archive className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-muted-foreground">
                    Archived Gifts ({archivedGifts.length})
                  </span>
                  <span className="text-xs text-muted-foreground/70">
                    Click to {showArchived ? 'hide' : 'show'} archived gifts
                  </span>
                </div>
              </div>
              {showArchived ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {showArchived && (
            <div className="opacity-70 bg-muted/20">
              {archivedGifts.map(renderGiftRow)}
            </div>
          )}
        </>
      )}

      {activeGifts.length === 0 && archivedGifts.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No gifts yet
        </div>
      )}
    </>
  );
}
