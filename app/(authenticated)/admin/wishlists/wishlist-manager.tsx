'use client';

import { KeyRound, Link2, Plus, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  createWishlistAdmin,
  createWishlistInviteAdmin,
  deleteWishlistAdmin,
  updateWishlistPinAdmin,
} from '@/app/_actions/admin-wishlists';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { buildInvitePath } from '@/lib/wishlist-invites';

type WishlistRow = {
  id: string;
  name: string;
  _count: {
    members: number;
    gifts: number;
  };
};

export function WishlistManager({ wishlists }: { wishlists: WishlistRow[] }) {
  const [isPending, startTransition] = useTransition();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');

  const [pinDialogWishlistId, setPinDialogWishlistId] = useState<string | null>(
    null,
  );
  const [pinDialogPin, setPinDialogPin] = useState('');

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) {
      toast.error('Wishlist name is required');
      return;
    }
    if (!/^\d{4}$/.test(newPin)) {
      toast.error('Pin must be 4 digits');
      return;
    }

    startTransition(async () => {
      const result = await createWishlistAdmin({ name, pin: newPin });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? 'Wishlist created');
      setNewName('');
      setNewPin('');
      setIsCreateDialogOpen(false);
    });
  };

  const handleUpdatePin = (wishlistId: string) => {
    if (!/^\d{4}$/.test(pinDialogPin)) {
      toast.error('Pin must be 4 digits');
      return;
    }

    startTransition(async () => {
      const result = await updateWishlistPinAdmin({
        wishlistId,
        pin: pinDialogPin,
      });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? 'Pin updated');
      setPinDialogPin('');
      setPinDialogWishlistId(null);
    });
  };

  const handleDelete = (wishlistId: string) => {
    startTransition(async () => {
      const result = await deleteWishlistAdmin({ wishlistId });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message ?? 'Wishlist deleted');
    });
  };

  const handleCreateInviteLink = (wishlistId: string) => {
    startTransition(async () => {
      const result = await createWishlistInviteAdmin({ wishlistId });
      if (result.error) {
        toast.error(result.error);
        return;
      }

      const token = result.token;
      if (!token) {
        toast.error('Invite link could not be generated');
        return;
      }

      const inviteUrl = `${window.location.origin}${buildInvitePath(token)}`;
      try {
        await navigator.clipboard.writeText(inviteUrl);
        toast.success('Invite link copied to clipboard');
      } catch {
        toast.message('Invite link', { description: inviteUrl });
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Wishlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Wishlist</DialogTitle>
              <DialogDescription>
                New wishlists require a 4-digit pin.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wishlistName">Name</Label>
                <Input
                  id="wishlistName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., Christmas 2026"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wishlistPin">Pin</Label>
                <Input
                  id="wishlistPin"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="0000"
                  maxLength={4}
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isPending}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Gifts</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wishlists.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.name}</TableCell>
                <TableCell>{w._count.members}</TableCell>
                <TableCell>{w._count.gifts}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreateInviteLink(w.id)}
                      disabled={isPending}
                      title="Create an invite link (bypasses pin)"
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Invite link
                    </Button>

                    <Dialog
                      open={pinDialogWishlistId === w.id}
                      onOpenChange={(open) => {
                        setPinDialogWishlistId(open ? w.id : null);
                        setPinDialogPin('');
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <KeyRound className="h-4 w-4 mr-2" />
                          Set pin
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Set pin</DialogTitle>
                          <DialogDescription>
                            Update the 4-digit pin for “{w.name}”.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          <Label htmlFor="updatePin">New pin</Label>
                          <Input
                            id="updatePin"
                            value={pinDialogPin}
                            onChange={(e) => setPinDialogPin(e.target.value)}
                            placeholder="0000"
                            maxLength={4}
                            inputMode="numeric"
                            pattern="[0-9]{4}"
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setPinDialogWishlistId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleUpdatePin(w.id)}
                            disabled={isPending}
                          >
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete wishlist</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will delete “{w.name}” and remove it from all
                            users and gifts. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(w.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {wishlists.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground">
                  No wishlists found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
