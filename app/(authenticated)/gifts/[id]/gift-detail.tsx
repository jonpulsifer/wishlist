'use client';

import { formatDistanceToNow } from 'date-fns';
import {
  Gift as GiftIcon,
  Loader2,
  Mail,
  Pencil,
  Save,
  Trash,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useOptimistic, useState } from 'react';
import {
  claimGift,
  deleteGift,
  unclaimGift,
  updateGift,
} from '@/app/_actions/gifts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useAction } from '@/hooks/use-action';
import type { GiftDetail as GiftDetailData } from '@/lib/db/projections';
import { getInitials } from '@/lib/utils';

interface GiftDetailProps {
  gift: GiftDetailData;
  currentUserId: string;
  canEdit: boolean;
}

export function GiftDetail({
  gift: initialGift,
  currentUserId,
  canEdit,
}: GiftDetailProps) {
  const router = useRouter();
  const [gift, setGift] = useOptimistic(initialGift);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [name, setName] = useState(gift.name);
  const [description, setDescription] = useState(gift.description || '');
  const [url, setUrl] = useState(gift.url || '');

  const update = useAction(updateGift, {
    optimistic: ({ name, description, url }) => {
      startTransition(() => setGift({ ...gift, name, description, url }));
      return () => startTransition(() => setGift(initialGift));
    },
    onSuccess: () => setIsEditing(false),
  });

  const flipClaim = () => {
    startTransition(() =>
      setGift((g) => ({
        ...g,
        claimed: !g.claimed,
        claimedByViewer: !g.claimedByViewer,
      })),
    );
    return flipClaim;
  };

  const claim = useAction(claimGift, { optimistic: flipClaim });
  const unclaim = useAction(unclaimGift, { optimistic: flipClaim });

  const destroy = useAction(deleteGift, {
    onSuccess: () => router.push('/gifts'),
  });

  const isPending =
    update.isPending ||
    claim.isPending ||
    unclaim.isPending ||
    destroy.isPending;

  const handleSave = () => update.run({ id: gift.id, name, description, url });

  const handleClaimToggle = () =>
    gift.claimedByViewer ? unclaim.run(gift.id) : claim.run(gift.id);

  const handleDelete = () => destroy.run(gift.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={gift.owner.image ?? undefined} />
          <AvatarFallback className="text-2xl">
            {getInitials(gift.owner)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">
              {gift.owner.name ?? gift.owner.email}
            </h1>
            <Badge variant="secondary">Owner</Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{gift.owner.email}</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <GiftIcon className="h-6 w-6 text-muted-foreground" />
            {isEditing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold h-auto py-1"
                placeholder="Gift name"
              />
            ) : (
              gift.name
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {canEdit && !isEditing && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
                disabled={isPending}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {isEditing && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(false)}
                  disabled={isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="default"
                  size="icon"
                  onClick={handleSave}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
            {canEdit && !isEditing && (
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">Product URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </>
            ) : (
              <>
                {gift.description && (
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <p className="text-sm text-muted-foreground">
                      {gift.description}
                    </p>
                  </div>
                )}
                {gift.url && (
                  <div className="space-y-1.5">
                    <Label>Product URL</Label>
                    <a
                      href={gift.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline block"
                    >
                      {gift.url}
                    </a>
                  </div>
                )}
              </>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Added by</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={gift.createdBy?.image ?? undefined} />
                    <AvatarFallback>
                      {gift.createdBy ? getInitials(gift.createdBy) : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-muted-foreground">
                    {gift.createdBy?.id === currentUserId
                      ? 'You'
                      : gift.createdBy?.name || gift.createdBy?.email}{' '}
                    (
                    {formatDistanceToNow(new Date(gift.createdAt), {
                      addSuffix: true,
                    })}
                    )
                  </p>
                </div>
              </div>
              {!canEdit && (
                <Button
                  variant={gift.claimedByViewer ? 'destructive' : 'default'}
                  onClick={handleClaimToggle}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {gift.claimedByViewer
                    ? 'Unclaim'
                    : gift.claimed
                      ? 'Claimed'
                      : 'Claim'}
                </Button>
              )}
            </div>

            {gift.wishlists.length > 0 && (
              <div className="space-y-2">
                <Label>Wishlists</Label>
                <div className="flex flex-wrap gap-2">
                  {gift.wishlists.map((wishlist) => (
                    <Link
                      key={wishlist.id}
                      href={`/wishlists/${wishlist.id}`}
                      className="inline-flex items-center"
                    >
                      <Badge variant="outline" className="hover:bg-secondary">
                        {wishlist.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
