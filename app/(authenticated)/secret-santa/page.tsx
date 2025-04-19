import { getSession } from '@/app/auth';
import db from '@/lib/db/client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getSecretSantaEvents } from '@/lib/db/queries-cached';
import { PlusIcon } from 'lucide-react';

interface SecretSantaAssignment {
  id: string;
  recipient: {
    id: string;
    name: string | null;
    address: string | null;
    sizes: {
      pants: string | null;
      shirt: string | null;
      shoes: string | null;
    } | null;
  };
  wishlist: {
    id: string;
    name: string;
    gifts: {
      id: string;
      name: string;
      description: string | null;
      url: string | null;
      claimed: boolean;
    }[];
  };
}

interface Gift {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  claimed: boolean;
}

export default async function SecretSantaPage() {
  const { user } = await getSession();

  // Get assignment and events
  const [assignment, events] = await Promise.all([
    db.secretSantaParticipant.findFirst({
      where: {
        userId: user.id,
        assignedToId: { not: null },
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
            wishlists: {
              select: {
                id: true,
                name: true,
                gifts: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    url: true,
                    claimed: true,
                  },
                },
              },
            },
          },
        },
        event: true,
      },
    }),
    getSecretSantaEvents(user.id),
  ]);

  // For current assignment, we need to adapt the data structure
  let currentAssignment = null;
  if (assignment?.assignedTo) {
    currentAssignment = {
      id: assignment.id,
      eventName: assignment.event?.name || 'Secret Santa',
      assignedTo: {
        id: assignment.assignedTo.id,
        name: assignment.assignedTo.name,
        address: assignment.assignedTo.address,
        pant_size: assignment.assignedTo.pant_size,
        shirt_size: assignment.assignedTo.shirt_size,
        shoe_size: assignment.assignedTo.shoe_size,
        wishlists: assignment.assignedTo.wishlists,
      },
    };
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Secret Santa</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Secret Santa</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              View your assigned recipient and organize Secret Santa events.
            </p>
          </div>
          <Button asChild>
            <Link href="/secret-santa/create">
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Event
            </Link>
          </Button>
        </div>

        {!currentAssignment ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              You haven't been assigned a Secret Santa recipient yet.
            </p>
            {events.length > 0 ? (
              <p className="text-sm text-muted-foreground mt-2">
                You are participating in{' '}
                {events.filter((e) => e.isParticipating).length} event(s), but
                assignments haven't been made yet.
              </p>
            ) : (
              <Button asChild className="mt-4">
                <Link href="/secret-santa/create">
                  Create a Secret Santa Event
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Recipient</CardTitle>
                <CardDescription>
                  For: {currentAssignment.eventName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Assigned To</h3>
                    <p className="text-lg font-semibold">
                      {currentAssignment.assignedTo.name || 'Unknown'}
                    </p>
                  </div>
                  {currentAssignment.assignedTo.address && (
                    <div>
                      <h3 className="font-medium mb-2">Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentAssignment.assignedTo.address}
                      </p>
                    </div>
                  )}
                  {(currentAssignment.assignedTo.pant_size ||
                    currentAssignment.assignedTo.shirt_size ||
                    currentAssignment.assignedTo.shoe_size) && (
                    <div>
                      <h3 className="font-medium mb-2">Sizes</h3>
                      <ul className="text-sm text-muted-foreground">
                        {currentAssignment.assignedTo.pant_size && (
                          <li>
                            Pants: {currentAssignment.assignedTo.pant_size}
                          </li>
                        )}
                        {currentAssignment.assignedTo.shirt_size && (
                          <li>
                            Shirt: {currentAssignment.assignedTo.shirt_size}
                          </li>
                        )}
                        {currentAssignment.assignedTo.shoe_size && (
                          <li>
                            Shoes: {currentAssignment.assignedTo.shoe_size}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {currentAssignment.assignedTo.wishlists.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recipient's Wishlist</CardTitle>
                  <CardDescription>
                    {currentAssignment.assignedTo.wishlists[0].name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentAssignment.assignedTo.wishlists[0].gifts.length ===
                  0 ? (
                    <p className="text-sm text-muted-foreground">
                      No gifts in this wishlist yet.
                    </p>
                  ) : (
                    <div className="rounded-md border">
                      <div className="hidden md:grid md:grid-cols-[1fr_200px_120px] gap-4 p-4 font-medium">
                        <div>Gift</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                      </div>
                      {currentAssignment.assignedTo.wishlists[0].gifts.map(
                        (gift: Gift) => (
                          <div
                            key={gift.id}
                            className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_200px_120px] gap-4 p-4 items-center border-t"
                          >
                            <div className="space-y-1">
                              <div className="font-medium">{gift.name}</div>
                              {gift.description && (
                                <div className="text-sm text-muted-foreground">
                                  {gift.description}
                                </div>
                              )}
                              {gift.url && (
                                <a
                                  href={gift.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-500 hover:underline"
                                >
                                  View Link
                                </a>
                              )}
                            </div>
                            <div className="text-muted-foreground">
                              {gift.claimed ? 'Claimed' : 'Available'}
                            </div>
                            <div className="text-right">
                              <Button
                                variant={
                                  gift.claimed ? 'destructive' : 'default'
                                }
                                size="sm"
                                className="w-20 md:w-24"
                                asChild
                              >
                                <Link href={`/gifts/${gift.id}`}>
                                  {gift.claimed ? 'Unclaim' : 'Claim'}
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* List of Secret Santa Events */}
        {events.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Your Secret Santa Events</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      {event.participants.length} participants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <span className="text-sm">
                          {event.participants.some((p) => p.assignedToId)
                            ? 'Assignments Made'
                            : 'Waiting for Assignments'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          Your Status:
                        </span>
                        <span className="text-sm">
                          {event.isParticipating
                            ? 'Participating'
                            : event.canJoin
                              ? 'Not Joined'
                              : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
