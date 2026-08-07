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
import { toggleViewerClaim, type WishCard } from '@/lib/db/projections';
import { getInitials } from '@/lib/utils';

interface GiftDetailProps {
  gift: WishCard;
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
  const [quantity, setQuantity] = useState(String(gift.quantity));

  // How many of a several-times-wanted Wish this viewer is speaking for. One,
  // unless they say otherwise, and never more than is left.
  const remaining = gift.yours ? 0 : gift.quantity - gift.spokenFor;
  const [claimAmount, setClaimAmount] = useState(1);

  const update = useAction(updateGift, {
    optimistic: ({ name, description, url, quantity }) => {
      startTransition(() =>
        setGift({ ...gift, name, description, url, quantity: quantity ?? 1 }),
      );
      return () => startTransition(() => setGift(initialGift));
    },
    onSuccess: () => setIsEditing(false),
  });

  const flipClaim = () => {
    startTransition(() => setGift((g) => toggleViewerClaim(g)));
    return flipClaim;
  };

  const claim = useAction(claimGift, { optimistic: () => flipClaim() });
  const unclaim = useAction(unclaimGift, { optimistic: flipClaim });

  const destroy = useAction(deleteGift, {
    onSuccess: () => router.push('/gifts'),
  });

  const isPending =
    update.isPending ||
    claim.isPending ||
    unclaim.isPending ||
    destroy.isPending;

  const handleSave = () =>
    update.run({
      id: gift.id,
      name,
      description,
      url,
      quantity: Number(quantity) || 1,
    });

  const handleClaimToggle = () =>
    !gift.yours && gift.claimedByViewer
      ? unclaim.run(gift.id)
      : claim.run({ id: gift.id, quantity: claimAmount });

  const handleDelete = () => destroy.run(gift.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={gift.subject.image ?? undefined} />
          <AvatarFallback className="text-2xl">
            {getInitials(gift.subject)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">
              {gift.subject.name ?? gift.subject.email}
            </h1>
            <Badge variant="secondary">Owner</Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{gift.subject.email}</span>
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
                <div className="space-y-2">
                  <Label htmlFor="quantity">How many?</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-24"
                  />
                  <p className="text-xs text-muted-foreground">
                    Five pairs of socks is one wish wanted five times.
                  </p>
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

          {!gift.yours && (gift.quantity > 1 || gift.joinedBy.length > 0) && (
            <div className="space-y-1 rounded-lg border border-primary/10 bg-primary/5 p-4">
              {gift.quantity > 1 && (
                <p className="text-sm font-medium">
                  Wanted {gift.quantity} times — {gift.spokenFor} spoken for,{' '}
                  {remaining} to go
                </p>
              )}
              {gift.joinedBy.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  You and{' '}
                  {gift.joinedBy
                    .map((person) => person.name || person.email)
                    .join(', ')}{' '}
                  are in on this
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Added by</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={gift.proposer.image ?? undefined} />
                    <AvatarFallback>
                      {getInitials(gift.proposer)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-muted-foreground">
                    {gift.proposer.id === currentUserId
                      ? 'You'
                      : gift.proposer.name || gift.proposer.email}{' '}
                    (
                    {formatDistanceToNow(new Date(gift.createdAt), {
                      addSuffix: true,
                    })}
                    )
                  </p>
                </div>
              </div>
              {!canEdit && !gift.yours && (
                <div className="flex items-center gap-2">
                  {!gift.claimedByViewer && remaining > 1 && (
                    <Input
                      type="number"
                      min={1}
                      max={remaining}
                      aria-label="How many are you getting?"
                      value={claimAmount}
                      onChange={(e) =>
                        setClaimAmount(
                          Math.min(
                            remaining,
                            Math.max(1, Number(e.target.value) || 1),
                          ),
                        )
                      }
                      className="w-20"
                    />
                  )}
                  <Button
                    variant={gift.claimedByViewer ? 'outline' : 'default'}
                    onClick={handleClaimToggle}
                    disabled={
                      isPending || (!gift.claimedByViewer && gift.claimed)
                    }
                  >
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {gift.claimedByViewer
                      ? 'Unclaim'
                      : gift.claimed
                        ? 'Claimed'
                        : remaining > 1
                          ? `Claim ${claimAmount}`
                          : 'Claim'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
