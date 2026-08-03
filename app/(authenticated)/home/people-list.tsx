'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { startTransition, useOptimistic } from 'react';
import { claimGift, unclaimGift } from '@/app/_actions/gifts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAction } from '@/hooks/use-action';
import type { GiftCard, PersonCard } from '@/lib/db/projections';
import { sortedForPerson } from '@/lib/shopping-progress';
import { getInitials } from '@/lib/utils';

/**
 * Everyone the viewer shops for, each row opening onto their Gifts so a claim
 * takes one tap and no navigation. Covered people fold away.
 */
export function PeopleList({
  people,
  gifts: initialGifts,
}: {
  people: PersonCard[];
  gifts: GiftCard[];
}) {
  const [gifts, setGifts] = useOptimistic(initialGifts);

  // Applying the same flip twice restores the row, so it is its own undo.
  const flipClaim = (giftId: string) => {
    startTransition(() =>
      setGifts((prev) =>
        prev.map(
          (g): GiftCard =>
            g.id === giftId && !g.yours
              ? {
                  ...g,
                  claimed: !g.claimed,
                  claimedByViewer: !g.claimedByViewer,
                }
              : g,
        ),
      ),
    );
    return () => flipClaim(giftId);
  };

  const claim = useAction(claimGift, { optimistic: flipClaim });
  const unclaim = useAction(unclaimGift, { optimistic: flipClaim });

  const byOwner = new Map<string, GiftCard[]>();
  for (const gift of gifts) {
    if (gift.archived) continue;
    const owned = byOwner.get(gift.ownerId) ?? [];
    owned.push(gift);
    byOwner.set(gift.ownerId, owned);
  }

  const rows = people.map((person) => {
    const owned = byOwner.get(person.id) ?? [];
    return { person, owned, sorted: sortedForPerson(owned) };
  });
  const todo = rows.filter((r) => !r.sorted);
  const done = rows.filter((r) => r.sorted);

  const row = ({ person, owned, sorted }: (typeof rows)[number]) => (
    <li key={person.id}>
      <Collapsible className="group">
        <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left transition-colors hover:bg-accent">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={person.image ?? undefined} />
            <AvatarFallback>{getInitials(person)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">
              {person.name ?? person.email}
              {sorted && <span className="ml-1.5">✅</span>}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {owned.length === 0
                ? 'No ideas on their list yet'
                : `${owned.length} idea${owned.length === 1 ? '' : 's'} to pick from`}
            </p>
          </div>
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>

        <CollapsibleContent>
          {owned.length === 0 ? (
            <p className="px-2 pb-3 pl-15 text-xs text-muted-foreground">
              Nothing here yet — nudge them to add some ideas.
            </p>
          ) : (
            <ul className="pb-2 pl-15 pr-2">
              {owned.map((gift) => (
                <li key={gift.id} className="flex items-center gap-2 py-1.5">
                  <Link
                    href={`/gifts/${gift.id}`}
                    className="min-w-0 flex-1 truncate text-sm hover:underline"
                  >
                    {gift.name}
                  </Link>
                  {!gift.yours &&
                    (gift.claimedByViewer ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-20 shrink-0"
                        onClick={() => unclaim.run(gift.id)}
                      >
                        Unclaim
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-20 shrink-0"
                        disabled={gift.claimed}
                        onClick={() => claim.run(gift.id)}
                      >
                        {gift.claimed ? 'Claimed' : 'Claim'}
                      </Button>
                    ))}
                </li>
              ))}
            </ul>
          )}
        </CollapsibleContent>
      </Collapsible>
    </li>
  );

  return (
    <div>
      {todo.length === 0 ? (
        <p className="py-6 text-center text-sm font-medium">
          Everyone's covered 🎉
        </p>
      ) : (
        <ul>{todo.map(row)}</ul>
      )}

      {done.length > 0 && (
        <Collapsible className="group/done mt-1">
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent">
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]/done:rotate-180" />
            Already covered ({done.length})
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="opacity-60">{done.map(row)}</ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
