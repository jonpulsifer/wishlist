'use client';

import { Loader2, Plus } from 'lucide-react';
import * as React from 'react';
import type { GiftFormData } from '@/app/_actions/gifts';
import { addGift } from '@/app/_actions/gifts';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAction } from '@/hooks/use-action';
import type { PersonRef } from '@/lib/db/projections';

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        'Add to wishlist'
      )}
    </Button>
  );
}

type Props = {
  users: Omit<PersonRef, 'image'>[];
  /** The id alone. A whole `Viewer` carries `can`, which cannot be serialised. */
  currentUserId: string;
};

export function AddGiftDialog({ users, currentUserId }: Props) {
  const [open, setOpen] = React.useState(false);
  const [recipientId, setRecipientId] = React.useState(currentUserId);
  const [asSubject, setAsSubject] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  // The dialog used to close and report "added successfully" whether or not the
  // action had succeeded; `onSuccess` only fires on the success branch.
  const { run, isPending, fieldErrors } = useAction(addGift, {
    onSuccess: () => {
      setOpen(false);
      formRef.current?.reset();
      setRecipientId(currentUserId);
      setAsSubject(false);
    },
  });

  const forSomeoneElse = recipientId !== currentUserId;

  const handleAction = (formData: FormData) => {
    const data: GiftFormData = {
      recipientId,
      name: formData.get('name') as string,
      url: formData.get('url') as string,
      description: formData.get('description') as string,
      quantity: Number(formData.get('quantity')) || 1,
      asSubject: forSomeoneElse && asSubject,
    };
    run(data);
  };

  const usersOptions = users.map((user) => {
    const isCurrentUser = user.id === currentUserId;
    const name = isCurrentUser
      ? `You (${user.name || user.email})`
      : user.name || user.email;
    return (
      <SelectItem key={user.id} value={user.id}>
        {name}
      </SelectItem>
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add New Gift</span>
          <span className="sm:hidden">Add Gift</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a new gift</DialogTitle>
          <DialogDescription>
            Use the form below to add a new gift to the wishlist
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={handleAction} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="recipientId" className="font-bold">
              Recipient
            </Label>
            <Select
              name="recipientId"
              value={recipientId}
              onValueChange={setRecipientId}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>People</SelectLabel>
                  {usersOptions}
                </SelectGroup>
              </SelectContent>
            </Select>
            {fieldErrors.recipientId && (
              <p className="text-sm text-red-500">{fieldErrors.recipientId}</p>
            )}
            <Label
              htmlFor="recipientId"
              className="text-xs text-muted-foreground font-normal"
            >
              Who is this gift for?
            </Label>
            {forSomeoneElse && (
              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="asSubject"
                  checked={asSubject}
                  onCheckedChange={(checked) => setAsSubject(checked === true)}
                />
                <Label
                  htmlFor="asSubject"
                  className="text-xs text-muted-foreground font-normal leading-snug"
                >
                  I'm filling in their list for them — put this on their own
                  list, where they can see it. Otherwise it stays a surprise.
                </Label>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-bold">
              Gift Name
            </Label>
            <Input id="name" name="name" placeholder="Enter gift name" />
            {fieldErrors.name && (
              <p className="text-sm text-red-500">{fieldErrors.name}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity" className="font-bold">
              How many?
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min={1}
              max={99}
              defaultValue={1}
              className="w-24"
            />
            {fieldErrors.quantity && (
              <p className="text-sm text-red-500">{fieldErrors.quantity}</p>
            )}
            <Label
              htmlFor="quantity"
              className="text-xs text-muted-foreground font-normal"
            >
              Five pairs of socks is one gift wanted five times, not five gifts.
            </Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url" className="font-bold">
              Link (optional)
            </Label>

            <Input
              id="url"
              name="url"
              placeholder="https://amazon.ca/your-gift-link"
              type="url"
            />
            {fieldErrors.url && (
              <p className="text-sm text-red-500">{fieldErrors.url}</p>
            )}
            <Label htmlFor="url" className="text-xs text-muted-foreground">
              Remember that Amazon is also available in Canada
            </Label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="font-bold">
              Notes (optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Add any additional notes..."
              className="min-h-[100px]"
            />
            {fieldErrors.description && (
              <p className="text-sm text-red-500">{fieldErrors.description}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            <SubmitButton isPending={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
