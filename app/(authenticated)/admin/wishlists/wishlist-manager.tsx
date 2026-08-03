'use client';

import { Link2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  createWishlistAdmin,
  createWishlistInviteAdmin,
  deleteWishlistAdmin,
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
import { useAction } from '@/hooks/use-action';
import { buildInvitePath } from '@/lib/wishlist-invites';

type WishlistRow = {
  id: string;
  name: string;
  _count: {
    members: number;
  };
};

export function WishlistManager({ wishlists }: { wishlists: WishlistRow[] }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const create = useAction(createWishlistAdmin, {
    onSuccess: () => {
      setNewName('');
      setIsCreateDialogOpen(false);
    },
  });

  const destroy = useAction(deleteWishlistAdmin);

  // The invite link is copied rather than announced, so this one replaces the
  // action's own message.
  const invite = useAction(createWishlistInviteAdmin, {
    success: false,
    onSuccess: async ({ token }) => {
      const url = `${window.location.origin}${buildInvitePath(token)}`;
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Invite link copied to clipboard');
      } catch {
        toast.message('Invite link', { description: url });
      }
    },
  });

  const isPending = create.isPending || destroy.isPending || invite.isPending;

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) {
      toast.error('Wishlist name is required');
      return;
    }
    create.run({ name });
  };

  const handleDelete = (wishlistId: string) => destroy.run({ wishlistId });

  const handleCreateInviteLink = (wishlistId: string) =>
    invite.run({ wishlistId });

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
                An invite link is the only way in.
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wishlists.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.name}</TableCell>
                <TableCell>{w._count.members}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreateInviteLink(w.id)}
                      disabled={isPending}
                      title="Create an invite link"
                    >
                      <Link2 className="h-4 w-4 mr-2" />
                      Invite link
                    </Button>

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
                            This will delete “{w.name}” and remove everyone from
                            it. Their gifts survive, but stop being visible to
                            each other through this list. This cannot be undone.
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
                <TableCell colSpan={3} className="text-muted-foreground">
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
