import { UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { SidebarInset } from '@/components/ui/sidebar';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getUsersForPeoplePage } from '@/lib/db/queries-cached';
import { getInitials } from '@/lib/utils';

export default async function PeoplePage() {
  const viewer = await requireViewerOrRedirect();
  const people = await getUsersForPeoplePage(viewer.id);
  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>People</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col gap-4 p-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              Your Wishlist Participants
            </CardTitle>
            <CardDescription>
              Here is a list of people who are part of your wishlists.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {people.map((person) => (
                  <TableRow
                    key={person.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell colSpan={2} className="p-0">
                      <Link
                        href={`/people/${person.id}`}
                        className="flex items-center justify-between p-4 w-full h-full"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={person.image ?? undefined} />
                            <AvatarFallback>
                              {getInitials(person)}
                            </AvatarFallback>
                          </Avatar>
                          {person.name ?? person.email}
                        </div>
                        <Badge
                          variant={
                            person.wishCount < 3 ? 'destructive' : 'secondary'
                          }
                        >
                          {person.wishCount} gift
                          {person.wishCount === 1 ? '' : 's'}
                        </Badge>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
