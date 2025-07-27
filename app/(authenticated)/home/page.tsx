import {
  AlertCircleIcon,
  CalendarIcon,
  ChevronRightIcon,
  GiftIcon,
  ListTodoIcon,
  PlusIcon,
  UserIcon,
  Users2Icon,
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
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Welcome back, {user.name || user.email}
            </p>
          </div>
          <AddGiftDialog currentUser={user} users={addGiftDialogUsers} />
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Claimed Gifts
              </CardTitle>
              <GiftIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{claimedGifts.length}</div>
              <p className="text-xs text-muted-foreground">
                Gifts you've claimed for others
              </p>
            </CardContent>
            <CardFooter className="p-2">
              <Link
                href="/claimed"
                className="text-xs text-primary flex items-center hover:underline"
              >
                View claimed gifts
                <ChevronRightIcon className="h-3 w-3 ml-1" />
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Your Wishlists
              </CardTitle>
              <ListTodoIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userWishlists.length}</div>
              <p className="text-xs text-muted-foreground">
                Wishlists you're a member of
              </p>
            </CardContent>
            <CardFooter className="p-2">
              <Link
                href="/wishlists"
                className="text-xs text-primary flex items-center hover:underline"
              >
                View all wishlists
                <ChevronRightIcon className="h-3 w-3 ml-1" />
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">People</CardTitle>
              <Users2Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{peopleWithGifts.length}</div>
              <p className="text-xs text-muted-foreground">
                People on your wishlists
              </p>
            </CardContent>
            <CardFooter className="p-2">
              <Link
                href="/people"
                className="text-xs text-primary flex items-center hover:underline"
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
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Latest Gifts</CardTitle>
              <CardDescription>
                Recently added gifts from people on your wishlists
              </CardDescription>
            </CardHeader>
            <CardContent>
              {latestGifts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent gifts found.
                </p>
              ) : (
                <div className="space-y-3">
                  {latestGifts.slice(0, 5).map((gift) => (
                    <div
                      key={gift.id}
                      className="flex items-center border-b border-muted pb-2"
                    >
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>
                          {gift.owner.name
                            ? gift.owner.name.charAt(0).toUpperCase()
                            : gift.owner.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {gift.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Added by {gift.owner.name || gift.owner.email}
                        </p>
                      </div>
                      <Link href={`/people/${gift.owner.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/gifts">
                <Button variant="outline">View All Gifts</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Alerts Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircleIcon className="h-5 w-5 mr-2 text-amber-500" />
                Attention Needed
              </CardTitle>
              <CardDescription>
                People who need gifts and other action items
              </CardDescription>
            </CardHeader>
            <CardContent>
              {peopleNeedingGifts.length === 0 ? (
                <div className="text-sm text-muted-foreground mb-4">
                  Everyone on your wishlists has gifts! 🎉
                </div>
              ) : (
                <div className="space-y-3 mb-4">
                  <div className="text-sm font-medium text-amber-500">
                    People with no gifts:
                  </div>
                  {peopleNeedingGifts.slice(0, 4).map((person) => (
                    <div key={person.id} className="flex items-center">
                      <Avatar className="h-7 w-7 mr-2">
                        <AvatarFallback>
                          {person.name
                            ? person.name.charAt(0).toUpperCase()
                            : person.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {person.name || person.email}
                      </span>
                      <div className="flex-grow" />
                      <Link href={`/people/${person.id}`}>
                        <Button size="sm" variant="outline">
                          Add Gift
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {/* Secret Santa Call to Action */}
              <div className="border-t pt-3">
                <div className="text-sm font-medium mb-3">Quick Actions:</div>
                <div className="space-y-2">
                  <Link href="/secret-santa">
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Check Secret Santa
                    </Button>
                  </Link>
                  <Link href="/secret-santa/create">
                    <Button variant="outline" className="w-full justify-start">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create Secret Santa Event
                    </Button>
                  </Link>
                  <Link href="/people/me">
                    <Button variant="outline" className="w-full justify-start">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Update Your Profile
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
