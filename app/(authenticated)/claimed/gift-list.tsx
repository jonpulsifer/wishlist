'use client';
import Link from 'next/link';
import { startTransition, useOptimistic } from 'react';
import { unclaimGift } from '@/app/_actions/gifts';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import type { GiftCard } from '@/lib/db/projections';

export default function GiftList({
  gifts: initialGifts,
}: {
  gifts: GiftCard[];
}) {
  const [gifts, setGifts] = useOptimistic(initialGifts);

  const { run: handleUnclaim } = useAction(unclaimGift, {
    optimistic: (giftId) => {
      startTransition(() => {
        setGifts((prev) => prev.filter((gift) => gift.id !== giftId));
      });
      return () => startTransition(() => setGifts(initialGifts));
    },
  });

  return (
    <div className="rounded-md border">
      <div className="hidden md:grid md:grid-cols-[1fr_200px_120px] gap-4 p-4 font-medium">
        <div>Gift</div>
        <div>Recipient</div>
        <div className="text-right">Actions</div>
      </div>
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_200px_120px] gap-4 p-4 items-center border-t"
        >
          <div className="space-y-1">
            <Link
              href={`/gifts/${gift.id}`}
              className="font-medium hover:text-primary transition-colors hover:underline"
            >
              {gift.name}
            </Link>
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
          <Link
            href={`/people/${gift.owner.id}`}
            className="text-muted-foreground"
          >
            {gift.owner.name || 'Unknown'}
          </Link>
          <div className="text-right">
            <Button
              variant="outline"
              size="sm"
              className="w-20 md:w-24"
              onClick={() => handleUnclaim(gift.id)}
            >
              Unclaim
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
