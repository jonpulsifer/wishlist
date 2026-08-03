import { ChevronRightIcon, GiftIcon } from 'lucide-react';
import Link from 'next/link';
import { AddGiftDialog } from '@/components/add-gift-dialog';
import { AppHeader } from '@/components/app-header';
import { PeekingSanta } from '@/components/peeking-santa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SidebarInset } from '@/components/ui/sidebar';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import db from '@/lib/db/client';
import {
  getLatestVisibleGiftsForUserById,
  getPeopleForNewGiftModal,
  getSortedVisibleGiftsForUser,
  getUsersForPeoplePage,
  getVisibleGiftsForUserById,
} from '@/lib/db/queries-cached';
import {
  christmasProgress,
  daysUntilChristmas,
  heldForCurrentOccasion,
} from '@/lib/season';
import { sortedForPerson } from '@/lib/shopping-progress';
import { getInitials } from '@/lib/utils';
import { PeopleList } from './people-list';

/**
 * Home answers, in order: how long have I got, who have I not sorted yet, and
 * can anyone shop for me. Search is a way to reach a thing you can already
 * name, so it stays in the header where navigation lives.
 */
export default async function HomePage() {
  const viewer = await requireViewerOrRedirect();

  const [
    addGiftDialogUsers,
    people,
    visibleGifts,
    myGifts,
    latestGifts,
    secretSantaParticipations,
  ] = await Promise.all([
    getPeopleForNewGiftModal(viewer.id),
    getUsersForPeoplePage(viewer.id),
    // Everyone's Gifts in one query rather than one per person, grouped by
    // owner in the client so claiming can update the tick optimistically.
    getSortedVisibleGiftsForUser({ userId: viewer.id }),
    getVisibleGiftsForUserById(viewer.id, viewer.id),
    getLatestVisibleGiftsForUserById(viewer.id),
    db.secretSantaParticipant.findMany({
      where: { userId: viewer.id, event: heldForCurrentOccasion() },
      include: {
        event: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { event: { createdAt: 'desc' } },
    }),
  ]);

  // Actionable first: people with ideas on their list, longest list first.
  const ordered = [...people].sort((a, b) => b.giftCount - a.giftCount);
  const sortedCount = people.filter((p) =>
    sortedForPerson(visibleGifts.filter((g) => g.ownerId === p.id)),
  ).length;
  const sleeps = daysUntilChristmas();

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      {/* p-6 matches the -translate-x-6 overhang below, so Santa pokes well
          clear of the cards without pushing the document sideways. */}
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 p-6">
        {/* The clock and the score — the two numbers that actually motivate. */}
        <section className="px-1 pt-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {sleeps === 0
                ? "It's Christmas 🎄"
                : `${sleeps} sleep${sleeps === 1 ? '' : 's'} to go`}
            </h1>
            <p className="text-sm text-muted-foreground">till Christmas</p>
          </div>
          <ProgressBar
            value={christmasProgress()}
            label="Progress through the year to Christmas"
            className="mt-2"
          />
        </section>

        {/* The job: who still needs something from you. Everyone lives in
            one list now — a tick marks done, rather than a second card. */}
        <div className="relative">
          {/* Clear of the card entirely at his full 36px width, so its left
              edge does not cut through him. Held to the 24px page gutter on
              mobile, where the container is the viewport and any more would
              scroll the document sideways. */}
          <PeekingSanta className="top-20 z-10 -translate-x-6 sm:-translate-x-9" />
          <Card>
            <CardHeader>
              <CardTitle>Who you're shopping for</CardTitle>
              <CardDescription>
                {people.length === 0
                  ? 'Nobody on your wishlists yet.'
                  : `${sortedCount} of ${people.length} covered — tap someone to claim from their list.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              {people.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="font-medium">Nobody on your wishlists yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Join or create a wishlist to start shopping.
                  </p>
                </div>
              ) : (
                <PeopleList people={ordered} gifts={visibleGifts} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* The other half of the app: can anyone shop for you. */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your list</CardTitle>
            <CardDescription>
              {myGifts.length === 0
                ? "It's empty — nobody can shop for you yet."
                : myGifts.length < 3
                  ? `${myGifts.length} idea${myGifts.length === 1 ? '' : 's'}. A few more gives people a choice.`
                  : `${myGifts.length} ideas. Looking good.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row">
            <AddGiftDialog
              currentUserId={viewer.id}
              users={addGiftDialogUsers}
            />
            <Link
              href="/people/me"
              className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              <GiftIcon className="h-4 w-4" />
              See my list
            </Link>
          </CardContent>
        </Card>

        {/* Only rendered when there is something to say. */}
        {secretSantaParticipations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">🎅 Secret Santa</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <ul>
                {secretSantaParticipations.map((p) => (
                  <li key={p.event.id}>
                    <Link
                      href={
                        p.assignedTo
                          ? `/people/${p.assignedTo.id}`
                          : '/secret-santa'
                      }
                      className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-accent"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">
                          {p.event.name || 'Event'}
                        </p>
                        <p className="truncate text-sm font-medium">
                          {p.assignedTo
                            ? `You have ${p.assignedTo.name || p.assignedTo.email}`
                            : 'Assignments not drawn yet'}
                        </p>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Ambient, so it sits last. */}
        {latestGifts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Just added</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <ul>
                {latestGifts.slice(0, 5).map((gift) => (
                  <li key={gift.id}>
                    <Link
                      href={`/gifts/${gift.id}`}
                      className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
                    >
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={gift.owner.image ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(gift.owner)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{gift.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {gift.owner.name || gift.owner.email}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </SidebarInset>
  );
}
