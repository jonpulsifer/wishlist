'use client';

import { Loader2, UsersIcon } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { leaveWishlist } from '@/app/_actions/wishlists';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAction } from '@/hooks/use-action';
import type { Prisma } from '@/prisma/generated/client';
import { InviteButton } from './family-actions';

interface WishlistCardProps {
  wishlist: Prisma.FamilyGetPayload<{
    select: {
      id: true;
      name: true;
      memberships: {
        select: {
          user: {
            select: {
              id: true;
              name: true;
              email: true;
            };
          };
        };
      };
    };
  }>;
}

// This component must be a direct child of the form for useFormStatus to work
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="destructive" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Leaving...
        </>
      ) : (
        'Leave Wishlist'
      )}
    </Button>
  );
}

export function WishlistCard({ wishlist }: WishlistCardProps) {
  const leave = useAction(leaveWishlist);
  const members = wishlist.memberships.map((m) => m.user);

  return (
    <Card id={`wishlist-${wishlist.id}`}>
      <CardHeader>
        <div>
          <CardTitle>{wishlist.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <UsersIcon className="h-3 w-3" />
            {members.length} members
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Members</h4>
            <ul className="text-sm text-muted-foreground">
              {members
                .sort((a, b) => {
                  const nameA = a.name || a.email;
                  const nameB = b.name || b.email;
                  return nameA.localeCompare(nameB);
                })
                .map((member) => (
                  <li key={member.id}>{member.name || member.email}</li>
                ))}
            </ul>
          </div>

          <InviteButton familyId={wishlist.id} />

          <form
            action={async () => {
              await leave.run(wishlist.id);
            }}
          >
            <SubmitButton />
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
