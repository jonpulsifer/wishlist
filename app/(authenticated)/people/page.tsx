import Link from 'next/link';
import { unauthorized } from 'next/navigation';
import { auth } from '@/app/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getUsersForPeoplePage } from '@/lib/db/queries-cached';
import { getInitials } from '@/lib/utils';

export default async function PeoplePage() {
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }
  const people = await getUsersForPeoplePage(session.user.id);
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>People</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <p className="text-sm text-muted-foreground">
          Here is a list of people who are part of your wishlists.
        </p>
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
                        <AvatarFallback>{getInitials(person)}</AvatarFallback>
                      </Avatar>
                      {person.name ?? person.email}
                    </div>
                    <Badge
                      variant={
                        person._count.gifts < 3 ? 'destructive' : 'default'
                      }
                    >
                      {person._count.gifts} gift
                      {person._count.gifts === 1 ? '' : 's'}
                    </Badge>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SidebarInset>
  );
}
