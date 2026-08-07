'use client';

import { Link2, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { createFamily, createInvite } from '@/app/_actions/wishlists';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAction } from '@/hooks/use-action';
import { buildInvitePath, INVITE_LIFETIME_DAYS } from '@/lib/invites';

export function CreateFamilyButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const create = useAction(createFamily, {
    onSuccess: () => {
      setName('');
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          New wishlist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new wishlist</DialogTitle>
          <DialogDescription>
            You will be its only member until you share an invite link.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="familyName">Name</Label>
          <Input
            id="familyName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pulsifers"
          />
          {create.fieldErrors.name && (
            <p className="text-sm text-red-500">{create.fieldErrors.name}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => create.run({ name })}
            disabled={create.isPending}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function InviteButton({ familyId }: { familyId: string }) {
  // The link is copied rather than announced, so this replaces the action's own
  // message.
  const invite = useAction(createInvite, {
    success: false,
    onSuccess: async ({ token }) => {
      const url = `${window.location.origin}${buildInvitePath(token)}`;
      const description = `It admits one person, and lasts ${INVITE_LIFETIME_DAYS} days.`;
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Invite link copied', { description });
      } catch {
        toast.message('Invite link', { description: url });
      }
    },
  });

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => invite.run(familyId)}
      disabled={invite.isPending}
    >
      <Link2 className="h-4 w-4" />
      Invite someone
    </Button>
  );
}
