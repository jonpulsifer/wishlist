'use client';

import { CalendarIcon, Trash2, Users } from 'lucide-react';
import { startTransition, useOptimistic } from 'react';
import { deleteSecretSantaEvent } from '@/app/_actions/secret-santa';
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
import { useToast } from '@/hooks/use-toast';

type SecretSantaEvent = {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string | null;
    email: string;
  };
  participants: {
    id: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
    assignedTo: {
      id: string;
      name: string | null;
      email: string;
    } | null;
  }[];
};

type EventListProps = {
  events: SecretSantaEvent[];
};

export function SecretSantaEventList({ events }: EventListProps) {
  const { toast } = useToast();
  const [optimisticEvents, setOptimisticEvents] = useOptimistic(events);

  const handleDelete = async (eventId: string, eventName: string) => {
    // Optimistically remove the event from the list
    startTransition(() => {
      setOptimisticEvents(
        optimisticEvents.filter((event) => event.id !== eventId),
      );
    });

    const result = await deleteSecretSantaEvent(eventId);

    if (!result.success) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      // Revert will happen automatically on next render
    } else {
      toast({
        title: 'Success',
        description: `"${eventName}" has been deleted.`,
      });
    }
  };

  if (optimisticEvents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No Secret Santa events found.</p>
      </div>
    );
  }

  // Separate current and past events
  const currentYear = new Date().getFullYear();
  const currentEvents = optimisticEvents.filter(
    (event) => new Date(event.createdAt).getFullYear() === currentYear,
  );
  const pastEvents = optimisticEvents.filter(
    (event) => new Date(event.createdAt).getFullYear() < currentYear,
  );

  return (
    <div className="space-y-8">
      {currentEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {currentYear} Events
          </h2>
          <div className="grid gap-4">
            {currentEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDelete}
                isPast={false}
              />
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-muted-foreground">
            Past Events
          </h2>
          <div className="grid gap-4 opacity-60">
            {pastEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={handleDelete}
                isPast={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EventCard({
  event,
  onDelete,
  isPast,
}: {
  event: SecretSantaEvent;
  onDelete: (eventId: string, eventName: string) => void;
  isPast: boolean;
}) {
  const hasAssignments = event.participants.some((p) => p.assignedTo);

  return (
    <Card className={isPast ? 'bg-muted/30' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={isPast ? 'text-muted-foreground' : ''}>
              {event.name}
            </CardTitle>
            <CardDescription className="mt-2 space-y-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {event.participants.length} participants
                </span>
                <span>
                  Created by: {event.createdBy.name || event.createdBy.email}
                </span>
              </div>
              <div className="text-xs">
                Created: {new Date(event.createdAt).toLocaleDateString()}
              </div>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {hasAssignments ? (
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                Assigned
              </span>
            ) : (
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full">
                Pending
              </span>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the Secret Santa event &quot;
                    {event.name}&quot; and all {event.participants.length}{' '}
                    participants. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(event.id, event.name)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      {event.participants.length > 0 && (
        <CardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Participants:</h4>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {event.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="text-sm border rounded p-2 bg-background/50"
                >
                  <div className="font-medium">
                    {participant.user.name || participant.user.email}
                  </div>
                  {participant.assignedTo && (
                    <div className="text-xs text-muted-foreground">
                      →{' '}
                      {participant.assignedTo.name ||
                        participant.assignedTo.email}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
