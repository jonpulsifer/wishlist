import { Archive, CalendarIcon, Gift, PlusIcon, Users } from 'lucide-react';
import Link from 'next/link';
import { PageContainer } from '@/components/shell/page-container';
import { PageHeader } from '@/components/shell/page-header';
import { PageTransition } from '@/components/shell/page-transition';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import db from '@/lib/db/client';
import { getExchanges } from '@/lib/db/queries-cached';
import { partitionBySeason } from '@/lib/season';
import { DeleteExchangeButton } from './organiser-actions';

export default async function SecretSantaPage() {
  const viewer = await requireViewerOrRedirect();

  // Get all assignments for the viewer and events
  const [assignments, events] = await Promise.all([
    db.participant.findMany({
      where: {
        userId: viewer.id,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            address: true,
            pant_size: true,
            shirt_size: true,
            shoe_size: true,
          },
        },
        exchange: true,
      },
    }),
    getExchanges(viewer.id),
  ]);

  // Create a map of assignments by eventId for easy lookup
  const assignmentsByEvent = new Map(assignments.map((a) => [a.exchangeId, a]));

  const {
    current: currentEvents,
    past: pastEvents,
    year: currentYear,
  } = partitionBySeason(events);

  return (
    <PageTransition>
      <PageContainer>
        <div className="flex flex-col gap-2">
          <PageHeader
            title="Secret Santa"
            actions={
              <Button asChild className="min-h-11">
                <Link
                  href="/secret-santa/create"
                  transitionTypes={['drill-in']}
                >
                  <PlusIcon />
                  Create New Event
                </Link>
              </Button>
            }
          />
          <p className="text-muted-foreground text-sm sm:text-base">
            View your Secret Santa events and assignments.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">
              No Secret Santa events yet.
            </p>
            <Button asChild className="min-h-11">
              <Link href="/secret-santa/create" transitionTypes={['drill-in']}>
                Create Your First Event
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Current Year Events */}
            {currentEvents.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {currentYear} Events
                </h2>
                <div className="grid gap-4">
                  {currentEvents.map((event) => {
                    const assignment = assignmentsByEvent.get(event.id);
                    const { hasAssignments } = event;

                    return (
                      <Card key={event.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <CardTitle className="break-words">
                                {event.name}
                              </CardTitle>
                              <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  {event.participantCount} participants
                                </span>
                                {event.isParticipating && (
                                  <span className="text-green-600 dark:text-green-400 font-medium">
                                    You're participating
                                  </span>
                                )}
                              </CardDescription>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              {event.isOrganiser && (
                                <DeleteExchangeButton
                                  exchangeId={event.id}
                                  name={event.name}
                                />
                              )}
                              {hasAssignments ? (
                                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                                  Active
                                </span>
                              ) : (
                                <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {assignment?.assignedTo ? (
                            <div className="space-y-3 bg-primary/5 p-4 rounded-lg border border-primary/10">
                              <div className="flex items-center gap-2 mb-2">
                                <Gift className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-primary">
                                  Your Assignment
                                </h3>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  You're giving to
                                </p>
                                <p className="text-lg font-bold mt-1">
                                  {assignment.assignedTo.name || 'Unknown'}
                                </p>
                              </div>
                              {assignment.assignedTo.address && (
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Address
                                  </p>
                                  <p className="text-sm mt-0.5">
                                    {assignment.assignedTo.address}
                                  </p>
                                </div>
                              )}
                              {(assignment.assignedTo.pant_size ||
                                assignment.assignedTo.shirt_size ||
                                assignment.assignedTo.shoe_size) && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    Sizes
                                  </p>
                                  <div className="flex gap-3 text-sm">
                                    {assignment.assignedTo.shirt_size && (
                                      <span>
                                        Shirt:{' '}
                                        {assignment.assignedTo.shirt_size}
                                      </span>
                                    )}
                                    {assignment.assignedTo.pant_size && (
                                      <span>
                                        Pants: {assignment.assignedTo.pant_size}
                                      </span>
                                    )}
                                    {assignment.assignedTo.shoe_size && (
                                      <span>
                                        Shoes: {assignment.assignedTo.shoe_size}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : event.isParticipating && hasAssignments ? (
                            <div className="text-center py-4 text-muted-foreground">
                              <p className="text-sm">
                                You're participating but haven't been assigned
                                yet.
                              </p>
                            </div>
                          ) : event.isParticipating ? (
                            <div className="text-center py-4 text-muted-foreground">
                              <p className="text-sm">
                                Waiting for assignments to be made.
                              </p>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              <p className="text-sm">
                                {event.canJoin
                                  ? 'You are not participating in this event.'
                                  : 'This event is closed.'}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Year Events */}
            {pastEvents.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-muted-foreground">
                  <Archive className="h-5 w-5" />
                  Past Events
                </h2>
                <div className="grid gap-4 opacity-60">
                  {pastEvents.map((event) => {
                    const assignment = assignmentsByEvent.get(event.id);
                    const eventYear = event.year;

                    return (
                      <Card key={event.id} className="bg-muted/30">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <CardTitle className="break-words text-muted-foreground">
                                {event.name}
                              </CardTitle>
                              <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  {event.participantCount} participants
                                </span>
                                <span>{eventYear}</span>
                              </CardDescription>
                            </div>
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                              Completed
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {assignment?.assignedTo ? (
                            <div className="text-sm text-muted-foreground">
                              <p>
                                You gave to:{' '}
                                <span className="font-medium">
                                  {assignment.assignedTo.name || 'Unknown'}
                                </span>
                              </p>
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              <p>You were not assigned in this event.</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </PageContainer>
    </PageTransition>
  );
}
