import { Mail, MapPin, Pencil, Ruler } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SidebarInset } from '@/components/ui/sidebar';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import {
  getVisibleGiftsForUserById,
  getVisibleProfile,
} from '@/lib/db/queries-cached';
import { getInitials } from '@/lib/utils';
import { UserGiftList } from './user-gift-list';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserPage({ params }: Props) {
  const viewer = await requireViewerOrRedirect();
  const { id: rawId } = await params;

  // Handle the 'me' vanity route
  const id = rawId === 'me' ? viewer.id : rawId;

  // Scoped read: someone the viewer shares no wishlist with is a 404, not a
  // profile page. A bare lookup by id used to expose addresses and sizes.
  const user = await getVisibleProfile(id, viewer.id);
  if (!user) {
    notFound();
  }
  const gifts = await getVisibleGiftsForUserById(id, viewer.id);

  const isOwnProfile = user.id === viewer.id;

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/people">People</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[150px] sm:max-w-none truncate">
                {user?.name || user?.email}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-2">
        <div className="container mx-auto py-6 space-y-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shrink-0">
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback className="text-md sm:text-2xl">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold truncate">
                  {user.name ?? user.email}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <Button asChild className="w-full sm:w-auto">
                <Link href="/people/me/edit">
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Shipping Address</div>
                    <div className="text-sm text-muted-foreground">
                      {user.address}
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Ruler className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-2 w-full">
                      <div className="font-medium">Sizes</div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Pants</div>
                          <div className="text-muted-foreground">
                            {user.pant_size}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Shirt</div>
                          <div className="text-muted-foreground">
                            {user.shirt_size}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Shoes</div>
                          <div className="text-muted-foreground">
                            {user.shoe_size}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Wishlist</CardTitle>
                <Badge variant="secondary">{gifts.length} gifts</Badge>
              </CardHeader>
              <CardContent className="w-full max-w-full">
                <UserGiftList gifts={gifts} currentUserId={viewer.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
