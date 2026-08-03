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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SidebarInset } from '@/components/ui/sidebar';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import db from '@/lib/db/client';
import {
  getClaimedGiftsForMe,
  getLatestVisibleGiftsForUserById,
  getPeopleForNewGiftModal,
  getUsersForPeoplePage,
  getVisibleGiftsForUserById,
} from '@/lib/db/queries-cached';
import {
  christmasProgress,
  daysUntilChristmas,
  heldForCurrentOccasion,
} from '@/lib/season';
import { shoppingProgress } from '@/lib/shopping-progress';
import { getInitials } from '@/lib/utils';

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
    claimedByMe,
    myGifts,
    latestGifts,
    secretSantaParticipations,
  ] = await Promise.all([
    getPeopleForNewGiftModal(viewer.id),
    getUsersForPeoplePage(viewer.id),
    getClaimedGiftsForMe(viewer.id),
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

  const { toShopFor, sortedPeople, claimedFor, total } = shoppingProgress(
    people,
    claimedByMe,
  );
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

      {/* p-4 matches PeekingSanta's 1rem overhang, so he never pushes the
          document sideways on a phone. */}
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-3 p-4">
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

        {/* The job: who still needs something from you. */}
        <Card className="relative isolate">
          {toShopFor.length === 0 && <PeekingSanta className="top-16" />}
          <CardHeader>
            <CardTitle>Still to shop for</CardTitle>
            <CardDescription>
              {toShopFor.length === 0
                ? 'Nothing left on your list.'
                : `${sortedPeople.length} of ${total} sorted — tap someone to see what they asked for.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            {toShopFor.length === 0 ? (
              <div className="py-6 text-center">
                <p className="font-medium">
                  {people.length === 0
                    ? 'Nobody on your wishlists yet'
                    : "Everyone's sorted"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {people.length === 0
                    ? 'Join or create a wishlist to start shopping.'
                    : 'Go put your feet up.'}
                </p>
              </div>
            ) : (
              <ul>
                {toShopFor.map((person) => (
                  <li key={person.id}>
                    <Link
                      href={`/people/${person.id}`}
                      className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-accent active:bg-accent"
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={person.image ?? undefined} />
                        <AvatarFallback>{getInitials(person)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {person.name ?? person.email}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {person.giftCount === 0
                            ? 'No ideas on their list yet'
                            : `${person.giftCount} idea${person.giftCount === 1 ? '' : 's'} to pick from`}
                        </p>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Done is worth showing, but folded away. */}
        {sortedPeople.length > 0 && (
          <Collapsible>
            <Card>
              <CollapsibleTrigger className="w-full text-left">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    <span>Already sorted ({sortedPeople.length})</span>
                    <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="px-2">
                  <ul>
                    {sortedPeople.map((person) => (
                      <li key={person.id}>
                        <Link
                          href={`/people/${person.id}`}
                          className="flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-accent"
                        >
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={person.image ?? undefined} />
                            <AvatarFallback>
                              {getInitials(person)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {person.name ?? person.email}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              You claimed{' '}
                              {claimedFor
                                .get(person.id)
                                ?.map((g) => g.name)
                                .join(', ')}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* The other half of the app: can anyone shop for you. */}
        <Card className="relative isolate">
          {/* He only turns up when the list is empty — a nudge, not wallpaper. */}
          {myGifts.length === 0 && <PeekingSanta className="top-6" />}
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
