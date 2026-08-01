'use client';

import { Plus, Trash2, UserX } from 'lucide-react';
import { startTransition, useOptimistic, useState } from 'react';
import {
  createSecretSantaExclusion,
  deleteSecretSantaExclusion,
} from '@/app/_actions/secret-santa';
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAction } from '@/hooks/use-action';

type User = {
  id: string;
  name: string | null;
  email: string;
};

type Exclusion = {
  user1: User;
  user2: User;
};

type ExclusionManagerProps = {
  exclusions: Exclusion[];
  users: User[];
};

export function ExclusionManager({ exclusions, users }: ExclusionManagerProps) {
  const [optimisticExclusions, setOptimisticExclusions] =
    useOptimistic(exclusions);
  const [user1Id, setUser1Id] = useState<string>('');
  const [user2Id, setUser2Id] = useState<string>('');

  const remove = useAction(deleteSecretSantaExclusion, {
    optimistic: ({ user1Id, user2Id }) => {
      const before = optimisticExclusions;
      startTransition(() =>
        setOptimisticExclusions(
          before.filter(
            (e) =>
              !(
                (e.user1.id === user1Id && e.user2.id === user2Id) ||
                (e.user1.id === user2Id && e.user2.id === user1Id)
              ),
          ),
        ),
      );
      return () => startTransition(() => setOptimisticExclusions(before));
    },
  });

  const create = useAction(createSecretSantaExclusion, {
    optimistic: ({ user1Id, user2Id }) => {
      const before = optimisticExclusions;
      const user1 = users.find((u) => u.id === user1Id);
      const user2 = users.find((u) => u.id === user2Id);
      if (!user1 || !user2) return;
      startTransition(() =>
        setOptimisticExclusions([...before, { user1, user2 }]),
      );
      return () => startTransition(() => setOptimisticExclusions(before));
    },
    onSuccess: () => {
      setUser1Id('');
      setUser2Id('');
    },
  });

  const handleDelete = (user1: User, user2: User) =>
    remove.run({ user1Id: user1.id, user2Id: user2.id });

  // "Both selected" and "not the same person" are the schema's rules too; these
  // just keep the round-trip out of the way of an obviously incomplete form.
  const canCreate = Boolean(user1Id && user2Id && user1Id !== user2Id);
  const isCreating = create.isPending;

  const handleCreate = () => {
    if (!canCreate) return;
    create.run({ user1Id, user2Id });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Exclusion Pairs
          </CardTitle>
          <CardDescription>
            Manage which users should never be matched together in Secret Santa
            (e.g., spouses, partners)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new exclusion */}
          <div className="border rounded-lg p-4 bg-accent/20">
            <h3 className="text-sm font-medium mb-3">Add New Exclusion</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={user1Id} onValueChange={setUser1Id}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select first user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="self-center text-muted-foreground">↔</span>

              <Select value={user2Id} onValueChange={setUser2Id}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select second user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleCreate}
                disabled={isCreating || !canCreate}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Existing exclusions */}
          {optimisticExclusions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserX className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No exclusion pairs configured</p>
              <p className="text-sm mt-1">
                Add exclusions to prevent certain users from being matched
                together
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Existing Exclusions</h3>
              <div className="grid gap-2">
                {optimisticExclusions.map((exclusion, index) => (
                  <div
                    key={`${exclusion.user1.id}-${exclusion.user2.id}-${index}`}
                    className="flex items-center justify-between border rounded-lg p-3 bg-background"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span className="font-medium">
                        {exclusion.user1.name || exclusion.user1.email}
                      </span>
                      <span className="text-muted-foreground">↔</span>
                      <span className="font-medium">
                        {exclusion.user2.name || exclusion.user2.email}
                      </span>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove exclusion?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will allow{' '}
                            {exclusion.user1.name || exclusion.user1.email} and{' '}
                            {exclusion.user2.name || exclusion.user2.email} to
                            be matched together in future Secret Santa events.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDelete(exclusion.user1, exclusion.user2)
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
