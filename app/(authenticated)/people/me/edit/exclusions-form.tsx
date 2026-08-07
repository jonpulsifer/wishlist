'use client';

import { UserX, X } from 'lucide-react';
import { startTransition, useOptimistic, useState } from 'react';
import { excludePerson, unexcludePerson } from '@/app/_actions/secret-santa';
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
import type { PersonRef } from '@/lib/db/projections';

type Props = {
  /** People the viewer shares a Family with. */
  people: PersonRef[];
  excluded: PersonRef[];
};

export function ExclusionsForm({ people, excluded }: Props) {
  const [optimistic, setOptimistic] = useOptimistic(excluded);
  const [picked, setPicked] = useState('');

  const add = useAction(excludePerson, {
    optimistic: (id) => {
      const before = optimistic;
      const person = people.find((p) => p.id === id);
      if (person) startTransition(() => setOptimistic([...before, person]));
      return () => startTransition(() => setOptimistic(before));
    },
    onSuccess: () => setPicked(''),
  });

  const remove = useAction(unexcludePerson, {
    optimistic: (id) => {
      const before = optimistic;
      startTransition(() => setOptimistic(before.filter((p) => p.id !== id)));
      return () => startTransition(() => setOptimistic(before));
    },
  });

  const excludedIds = new Set(optimistic.map((p) => p.id));
  const choices = people.filter((p) => !excludedIds.has(p.id));
  const label = (p: PersonRef) => p.name || p.email;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserX className="h-5 w-5" />
          Secret Santa
        </CardTitle>
        <CardDescription>
          People you should never be matched with — a partner you already buy
          for, say. It works both ways, and only the two of you can see it: the
          person running the draw cannot.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={picked} onValueChange={setPicked}>
            <SelectTrigger className="sm:flex-1">
              <SelectValue placeholder="Pick someone" />
            </SelectTrigger>
            <SelectContent>
              {choices.map((person) => (
                <SelectItem key={person.id} value={person.id}>
                  {label(person)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={() => add.run(picked)}
            disabled={!picked || add.isPending}
          >
            Never match us
          </Button>
        </div>

        {optimistic.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have not excluded anyone.
          </p>
        ) : (
          <ul className="divide-y rounded-md border">
            {optimistic.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between gap-2 px-3 py-2"
              >
                <span className="truncate text-sm">{label(person)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Stop excluding ${label(person)}`}
                  onClick={() => remove.run(person.id)}
                  disabled={remove.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
