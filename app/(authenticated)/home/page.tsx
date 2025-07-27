import {
  AlertCircleIcon,
  CalendarIcon,
  ChevronRightIcon,
  GiftIcon,
  Heart,
  ListTodoIcon,
  PlusIcon,
  Sparkles,
  Star,
  UserIcon,
  Users2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { unauthorized } from 'next/navigation';
import { getSession } from '@/app/auth';
import { AddGiftDialog } from '@/components/add-gift-dialog';
import { AppHeader } from '@/components/app-header';
import { FestiveTip } from '@/components/festive-tip';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SidebarInset } from '@/components/ui/sidebar';
import {
  getClaimedGiftsForMe,
  getLatestVisibleGiftsForUserById,
  getPeopleForNewGiftModal,
  getUsersWithGiftCount,
  getWishlistsWithMemberIds,
} from '@/lib/db/queries-cached';

export default async function HomePage() {
  const { user } = await getSession();
  if (!user?.id) {
    return unauthorized();
  }

  // Fetch data for the dashboard
  const [
    addGiftDialogUsers,
    claimedGifts,
    latestGifts,
    peopleWithGifts,
    wishlists,
  ] = await Promise.all([
    getPeopleForNewGiftModal(user.id),
    getClaimedGiftsForMe(user.id),
    getLatestVisibleGiftsForUserById(user.id),
    getUsersWithGiftCount(user.id),
    getWishlistsWithMemberIds(),
  ]);

  // Filter wishlists where the user is a member
  const userWishlists = wishlists.filter((wishlist) =>
    wishlist.members.some((member) => member.id === user.id),
  );

  // Get people who need gifts (0 gifts count)
  const peopleNeedingGifts = peopleWithGifts.filter(
    (person) => person._count.gifts === 0,
  );

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
      <div className="flex flex-1 flex-col gap-6 p-4">
        {/* Welcome Header with festive elements */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 via-green-500 to-red-500 bg-clip-text text-transparent animate-gradient-shift">
                  Dashboard
                </h1>
                <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-muted-foreground text-sm sm:text-base flex items-center gap-2">
                Welcome back,{' '}
                <span className="font-semibold text-foreground">
                  {user.name || user.email}
                </span>
                <span className="text-lg">🎄</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1 italic">
                "The best way to spread Christmas cheer is singing loud for all
                to hear!" 🎵
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <AddGiftDialog currentUser={user} users={addGiftDialogUsers} />
              <div className="text-xs text-center text-muted-foreground">
                🎁 Add joy, one gift at a time
              </div>
            </div>
          </div>
        </div>

        {/* Festive Tip */}
        <FestiveTip />

        {/* Festive Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="relative overflow-hidden border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50/70 to-pink-50/70 dark:from-red-950/70 dark:to-pink-950/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-200 dark:bg-red-800 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                🎁 Claimed Gifts
              </CardTitle>
              <GiftIcon className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {claimedGifts.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Gifts you've claimed for others ❤️
              </p>
            </CardContent>
            <CardFooter className="p-2">
              <Link
                href="/claimed"
                className="text-xs text-red-600 dark:text-red-400 flex items-center hover:underline font-medium"
              >
                View claimed gifts
                <ChevronRightIcon className="h-3 w-3 ml-1" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="relative overflow-hidden border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/70 to-emerald-50/70 dark:from-green-950/70 dark:to-emerald-950/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 dark:bg-green-800 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                📝 Your Wishlists
              </CardTitle>
              <ListTodoIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {userWishlists.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Wishlists you're a member of 🌟
              </p>
            </CardContent>
            <CardFooter className="p-2">
              <Link
                href="/wishlists"
                className="text-xs text-green-600 dark:text-green-400 flex items-center hover:underline font-medium"
              >
                View all wishlists
                <ChevronRightIcon className="h-3 w-3 ml-1" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="relative overflow-hidden border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 dark:from-blue-950/70 dark:to-indigo-950/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 dark:bg-blue-800 rounded-full -translate-y-10 translate-x-10 opacity-20"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                👥 People
              </CardTitle>
              <Users2Icon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {peopleWithGifts.length}
              </div>
              <p className="text-xs text-muted-foreground">
                People on your wishlists 🤗
              </p>
            </CardContent>
            <CardFooter className="p-2">
              <Link
                href="/people"
                className="text-xs text-blue-600 dark:text-blue-400 flex items-center hover:underline font-medium"
              >
                View all people
                <ChevronRightIcon className="h-3 w-3 ml-1" />
              </Link>
            </CardFooter>
          </Card>
        </div>

        {/* Recent Activity and Alerts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Latest Gifts */}
          <Card className="md:col-span-1 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/70 to-violet-50/70 dark:from-purple-950/70 dark:to-violet-950/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ✨ Latest Gifts
                <Star className="h-4 w-4 text-yellow-500" />
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
                    <div
                      key={gift.id}
                      className="flex items-center border-b border-muted pb-2 hover:bg-background/50 rounded p-2 transition-colors"
                    >
                      <Avatar className="h-8 w-8 mr-2 ring-2 ring-purple-200 dark:ring-purple-800">
                        <AvatarFallback className="bg-gradient-to-br from-purple-400 to-violet-400 text-white">
                          {gift.owner.name
                            ? gift.owner.name.charAt(0).toUpperCase()
                            : gift.owner.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none flex items-center gap-1">
                          {gift.name}
                          <Sparkles className="h-3 w-3 text-yellow-500" />
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Added by {gift.owner.name || gift.owner.email}
                        </p>
                      </div>
                      <Link href={`/people/${gift.owner.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-purple-100 dark:hover:bg-purple-900"
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/gifts" className="w-full">
                <Button
                  variant="outline"
                  className="w-full hover:bg-purple-100 dark:hover:bg-purple-900"
                >
                  🎁 View All Gifts
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Alerts Card */}
          <Card className="md:col-span-1 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/70 to-orange-50/70 dark:from-amber-950/70 dark:to-orange-950/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircleIcon className="h-5 w-5 mr-2 text-amber-500" />🚨
                Attention Needed
                <Heart className="h-4 w-4 ml-auto text-red-500 animate-pulse" />
              </CardTitle>
              <CardDescription>
                People who need gifts and other action items 🎄
              </CardDescription>
            </CardHeader>
            <CardContent>
              {peopleNeedingGifts.length === 0 ? (
                <div className="text-center py-4 mb-4">
                  <div className="text-6xl mb-3">🎉</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    Everyone on your wishlists has gifts!
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    You're spreading the holiday cheer perfectly! ✨
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  <div className="text-sm font-medium text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    🎯 People with no gifts:
                    <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full text-xs">
                      {peopleNeedingGifts.length}
                    </span>
                  </div>
                  {peopleNeedingGifts.slice(0, 4).map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center p-2 hover:bg-background/50 rounded transition-colors"
                    >
                      <Avatar className="h-7 w-7 mr-2 ring-2 ring-amber-200 dark:ring-amber-800">
                        <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-400 text-white">
                          {person.name
                            ? person.name.charAt(0).toUpperCase()
                            : person.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm flex-1">
                        {person.name || person.email}
                      </span>
                      <Link href={`/people/${person.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-amber-100 dark:hover:bg-amber-900"
                        >
                          🎁 Add Gift
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Secret Santa Call to Action */}
              <div className="border-t pt-3">
                <div className="text-sm font-medium mb-3 flex items-center gap-2">
                  🎬 Quick Actions:
                  <Sparkles className="h-3 w-3 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <Link href="/secret-santa">
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-red-50 dark:hover:bg-red-950 group"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 group-hover:text-red-500" />
                      🎅 Check Secret Santa
                    </Button>
                  </Link>
                  <Link href="/secret-santa/create">
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-950 group"
                    >
                      <PlusIcon className="mr-2 h-4 w-4 group-hover:text-green-500" />
                      ✨ Create Secret Santa Event
                    </Button>
                  </Link>
                  <Link href="/people/me">
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-950 group"
                    >
                      <UserIcon className="mr-2 h-4 w-4 group-hover:text-blue-500" />
                      👤 Update Your Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
