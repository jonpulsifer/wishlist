import { Mail, MapPin, Pencil, Ruler } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/shell/page-container';
import { PageHeader } from '@/components/shell/page-header';
import { PageTransition } from '@/components/shell/page-transition';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import {
  getVisibleProfile,
  getVisibleWishesForUserById,
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
  const gifts = await getVisibleWishesForUserById(id, viewer.id);

  const isOwnProfile = user.id === viewer.id;

  return (
    <PageTransition>
      <PageContainer className="gap-6">
        <PageHeader
          backHref="/people"
          backLabel="People"
          title={
            <span className="flex min-w-0 items-center gap-3">
              <Avatar className="size-12 sm:size-14">
                <AvatarImage src={user.image ?? undefined} alt="" />
                <AvatarFallback className="text-lg sm:text-xl">
                  {getInitials(user)}
                </AvatarFallback>
              </Avatar>
              <span className="truncate">{user.name ?? user.email}</span>
            </span>
          }
          actions={
            isOwnProfile && (
              <Button asChild className="min-h-11">
                <Link href="/people/me/edit">
                  <Pencil className="h-4 w-4" />
                  Edit profile
                </Link>
              </Button>
            )
          }
        />

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="min-w-0">
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground break-words">
                    {user.email}
                  </div>
                </div>
              </div>
              <Separator />
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Wishlist</CardTitle>
              <Badge variant="secondary">{gifts.length} gifts</Badge>
            </CardHeader>
            <CardContent className="w-full max-w-full">
              <UserGiftList gifts={gifts} currentUserId={viewer.id} />
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </PageTransition>
  );
}
