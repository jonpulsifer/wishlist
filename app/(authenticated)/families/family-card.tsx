'use client';

import { Loader2, UsersIcon } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { leaveFamily } from '@/app/_actions/families';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAction } from '@/hooks/use-action';
import type { Prisma } from '@/prisma/generated/client';
import { InviteButton } from './family-actions';

interface FamilyCardProps {
  family: Prisma.FamilyGetPayload<{
    select: {
      id: true;
      name: true;
      memberships: {
        select: {
          user: {
            select: {
              id: true;
              name: true;
              email: true;
            };
          };
        };
      };
    };
  }>;
}

// This component must be a direct child of the form for useFormStatus to work
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="destructive" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Leaving...
        </>
      ) : (
        'Leave'
      )}
    </Button>
  );
}

export function FamilyCard({ family }: FamilyCardProps) {
  const leave = useAction(leaveFamily);
  const members = family.memberships.map((m) => m.user);

  return (
    <Card id={`family-${family.id}`}>
      <CardHeader>
        <div>
          <CardTitle>{family.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <UsersIcon className="h-3 w-3" />
            {members.length} members
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Members</h4>
            <ul className="text-sm text-muted-foreground">
              {members
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

          <InviteButton familyId={family.id} />

          <form
            action={async () => {
              await leave.run(family.id);
            }}
          >
            <SubmitButton />
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
