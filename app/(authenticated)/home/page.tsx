import {
  ChevronRightIcon,
  GiftIcon,
  Sparkles,
  Star,
  UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { unauthorized } from 'next/navigation';
import { getSession } from '@/app/auth';
import { AddGiftDialog } from '@/components/add-gift-dialog';
import { AppHeader } from '@/components/app-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SidebarInset } from '@/components/ui/sidebar';
import db from '@/lib/db/client';
import {
  getLatestVisibleGiftsForUserById,
  getPeopleForNewGiftModal,
} from '@/lib/db/queries-cached';

export default async function HomePage() {
  const { user } = await getSession();
  if (!user?.id) {
    return unauthorized();
  }

  // Fetch data for the dashboard
  const [addGiftDialogUsers, latestGifts, secretSantaParticipations] =
    await Promise.all([
      getPeopleForNewGiftModal(user.id),
      getLatestVisibleGiftsForUserById(user.id),
      db.secretSantaParticipant.findMany({
        where: {
          userId: user.id,
          event: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), 0, 1),
              lt: new Date(new Date().getFullYear() + 1, 0, 1),
            },
          },
        },
        include: {
          event: { select: { id: true, name: true } },
          assignedTo: { select: { id: true, name: true, email: true } },
        },
        orderBy: { event: { createdAt: 'desc' } },
      }),
    ]);

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
      <div className="flex flex-1 flex-col gap-6 p-4 max-w-full overflow-hidden">
        {/* Welcome Header with festive elements */}
        <div className="relative">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words min-w-0">
                  Welcome back, {user.name || user.email}
                </h1>
                <Sparkles className="h-5 w-5 text-yellow-500/70 flex-shrink-0" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <AddGiftDialog currentUser={user} users={addGiftDialogUsers} />
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/claimed">
                  <GiftIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">View Claimed Gifts</span>
                  <span className="sm:hidden">Claimed</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/people/me">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">View My Profile</span>
                  <span className="sm:hidden">Profile</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Festive Stats Cards */}
        <div>
          <Card className="relative overflow-hidden border-red-200/50 dark:border-red-800/50 bg-gradient-to-br from-red-50/30 to-pink-50/30 dark:from-red-950/30 dark:to-pink-950/30">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-200 dark:bg-red-800 rounded-full -translate-y-10 translate-x-10 opacity-10"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                🎅 Secret Santa
              </CardTitle>
              <Sparkles className="h-4 w-4 text-yellow-500/60" />
            </CardHeader>
            <CardContent>
              {secretSantaParticipations.length === 0 ? (
                <Link href="/secret-santa" className="block">
                  <div className="text-center py-4 hover:opacity-80 transition-opacity">
                    <div className="text-5xl mb-3">🎅</div>
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400 mb-1">
                      No Secret Santa Yet
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Create or join a Secret Santa event!
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="space-y-4">
                  {secretSantaParticipations.slice(0, 2).map((p) => (
                    <div key={p.event.id} className="space-y-2">
                      <div className="text-xs font-semibold text-red-600/80 dark:text-red-400/80 uppercase tracking-wide">
                        {p.event.name || 'Event'}
                      </div>
                      {p.assignedTo ? (
                        <Link
                          href={`/people/${p.assignedTo.id}`}
                          className="block group"
                        >
                          <div className="bg-background/60 rounded-lg p-3 border border-red-200/30 dark:border-red-800/30 hover:shadow-md hover:border-red-300/50 dark:hover:border-red-700/50 transition-all duration-200">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-red-200/50 dark:ring-red-800/50 group-hover:ring-red-300/70 dark:group-hover:ring-red-700/70 transition-all flex-shrink-0">
                                <AvatarFallback className="bg-gradient-to-br from-red-500/70 to-pink-500/70 text-white text-sm sm:text-lg">
                                  {p.assignedTo.name
                                    ? p.assignedTo.name.charAt(0).toUpperCase()
                                    : p.assignedTo.email
                                        .charAt(0)
                                        .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-muted-foreground mb-1">
                                  You're Secret Santa for:
                                </div>
                                <div className="text-sm font-semibold group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors truncate">
                                  {p.assignedTo.name || p.assignedTo.email}
                                </div>
                              </div>
                              <ChevronRightIcon className="h-5 w-5 text-red-500/40 group-hover:text-red-500/70 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="bg-background/60 rounded-lg p-3 border border-red-200/30 dark:border-red-800/30">
                          <div className="text-center text-sm text-muted-foreground italic">
                            Assignments not yet made
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {secretSantaParticipations.length > 2 && (
                    <Link
                      href="/secret-santa"
                      className="block text-xs text-center text-muted-foreground pt-2 border-t border-red-200/20 dark:border-red-800/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      + {secretSantaParticipations.length - 2} more event
                      {secretSantaParticipations.length - 2 !== 1 ? 's' : ''}
                    </Link>
                  )}
                  <Link
                    href="/secret-santa"
                    className="text-xs text-red-600 dark:text-red-400 flex items-center justify-end font-medium hover:underline mt-2"
                  >
                    View all details
                    <ChevronRightIcon className="h-3 w-3 ml-1" />
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Latest Gifts Card */}
        <Card className="relative overflow-hidden border-green-200/50 dark:border-green-800/50 bg-gradient-to-br from-green-50/30 to-emerald-50/30 dark:from-green-950/30 dark:to-emerald-950/30">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full -translate-y-10 translate-x-10 opacity-10"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ✨ Latest Gifts
              <Star className="h-4 w-4 text-yellow-500/60" />
            </CardTitle>
            <CardDescription>
              Recently added gifts from people on your wishlists 🎁
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestGifts.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">🎁</div>
                <p className="text-sm text-muted-foreground">
                  No recent gifts found.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Be the first to add some holiday magic! ✨
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {latestGifts.slice(0, 5).map((gift) => (
                  <Link
                    href={`/gifts/${gift.id}`}
                    key={gift.id}
                    className="flex items-center border-b border-muted pb-2 hover:bg-accent/30 rounded p-2 transition-colors"
                  >
                    <Avatar className="h-8 w-8 mr-2 ring-1 ring-green-200/50 dark:ring-green-800/50">
                      <AvatarFallback className="bg-gradient-to-br from-green-500/70 to-emerald-500/70 text-white text-xs">
                        {gift.owner.name
                          ? gift.owner.name.charAt(0).toUpperCase()
                          : gift.owner.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate">
                        {gift.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Added by {gift.owner.name || gift.owner.email}
                      </p>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                  </Link>
                ))}
                <Link
                  href="/gifts"
                  className="text-xs text-green-600 dark:text-green-400 flex items-center justify-end font-medium hover:underline mt-2"
                >
                  View all gifts
                  <ChevronRightIcon className="h-3 w-3 ml-1" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
