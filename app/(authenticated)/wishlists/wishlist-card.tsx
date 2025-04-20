'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { handleWishlistAction } from '@/app/actions';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
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

export function WishlistCard({ wishlist, isMember }: WishlistCardProps) {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [pin, setPin] = useState('');

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    try {
      const result = await handleWishlistAction(
        wishlist.id,
        isMember,
        formData.get('pin') as string,
      );

      if (result.error) {
        toast({
          variant: 'destructive',
          description: result.error,
        });
      } else if (result.message) {
        toast({
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsPending(false);
    }
  };

  const isButtonDisabled = isPending || (!isMember && !pin);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{wishlist.name}</CardTitle>
        <CardDescription>
          {isMember ? `${wishlist.members.length} members` : 'Private wishlist'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isMember && (
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
          {!isMember && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="text"
                  name="pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="0000"
                  className="w-full text-center tracking-widest"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Enter 4-digit pin
              </p>
            </div>
          )}
          <form action={handleSubmit}>
            <Button
              variant={isMember ? 'destructive' : 'default'}
              className="w-full"
              disabled={isButtonDisabled}
            >
              {isPending ? (
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
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
