'use client';

import { Loader2, LockIcon, UsersIcon } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { joinWishlist, leaveWishlist } from '@/app/_actions/wishlists';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAction } from '@/hooks/use-action';
import type { Prisma } from '@/prisma/generated/client';

interface WishlistCardProps {
  wishlist: Prisma.WishlistGetPayload<{
    select: {
      id: true;
      name: true;
      members: {
        select: {
          id: true;
          name: true;
          email: true;
        };
      };
    };
  }>;
  isMember: boolean;
}

// This component must be a direct child of the form for useFormStatus to work
function SubmitButton({ isMember }: { isMember: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      variant={isMember ? 'destructive' : 'default'}
      className="w-full"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isMember ? 'Leaving...' : 'Joining...'}
        </>
      ) : isMember ? (
        'Leave Wishlist'
      ) : (
        'Join Wishlist'
      )}
    </Button>
  );
}

export function WishlistCard({ wishlist, isMember }: WishlistCardProps) {
  const join = useAction(joinWishlist);
  const leave = useAction(leaveWishlist);

  // Which of the two runs is decided here, from the membership the server
  // rendered — not sent to the server as a flag for it to branch on.
  async function handleWishlistSubmit(formData: FormData) {
    if (isMember) {
      await leave.run(wishlist.id);
      return;
    }
    await join.run({
      wishlistId: wishlist.id,
      pin: formData.get('pin') as string,
    });
  }

  return (
    <Card id={`wishlist-${wishlist.id}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{wishlist.name}</CardTitle>
            <CardDescription className="flex items-center gap-1">
              <UsersIcon className="h-3 w-3" />
              {isMember
                ? `${wishlist.members.length} members`
                : 'Private wishlist'}
            </CardDescription>
          </div>
          {!isMember && <LockIcon className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Member list - only shown to members */}
          {isMember && wishlist.members.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Members</h4>
              <ul className="text-sm text-muted-foreground">
                {wishlist.members
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
          )}

          {/* For non-members, show privacy message */}
          {!isMember && (
            <p className="text-sm text-muted-foreground">
              Join this wishlist to see its members and gifts.
            </p>
          )}

          {/* Form for joining/leaving */}
          <form action={handleWishlistSubmit} className="space-y-4">
            {!isMember && (
              <div className="space-y-2">
                <Input
                  type="text"
                  name="pin"
                  placeholder="0000"
                  className="w-full text-center tracking-widest"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                  required
                />
                <p className="text-xs text-muted-foreground text-center">
                  Enter 4-digit pin
                </p>
              </div>
            )}

            <SubmitButton isMember={isMember} />
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
