import { Mail, MapPin, Ruler } from 'lucide-react';
import { notFound, unauthorized } from 'next/navigation';
import { auth } from '@/app/auth';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SidebarInset } from '@/components/ui/sidebar';
import {
  getUserById,
  getVisibleGiftsForUserById,
} from '@/lib/db/queries-cached';
import { getInitials } from '@/lib/utils';
import { UserGiftList } from './user-gift-list';

export default async function UserPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }
  const user = await getUserById(session.user.id);
  const gifts = await getVisibleGiftsForUserById(
    session.user.id,
    session.user.id,
  );
  if (!user) {
    notFound();
  }

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
              <BreadcrumbPage>{user?.name || user?.email}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="container mx-auto py-6 space-y-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="text-2xl">
                {getInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user.name ?? user.email}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
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
                    <div className="space-y-2">
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Wishlist</CardTitle>
                <Badge variant="secondary">{gifts.length} gifts</Badge>
              </CardHeader>
              <CardContent>
                <UserGiftList gifts={gifts} currentUserId={session.user.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
