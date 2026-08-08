import Link from 'next/link';
import { PageContainer } from '@/components/shell/page-container';
import { PageTransition } from '@/components/shell/page-transition';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getUsersForPeoplePage } from '@/lib/db/queries-cached';
import { getInitials } from '@/lib/utils';

export default async function PeoplePage() {
  const viewer = await requireViewerOrRedirect();
  const people = await getUsersForPeoplePage(viewer.id);
  return (
    <PageTransition>
      <PageContainer>
        <header className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            People
          </h1>
          <p className="text-sm text-muted-foreground">
            Everyone on your wishlists. Tap someone to see what they want.
          </p>
        </header>

        <Card>
          <CardContent className="px-2">
            {people.length === 0 ? (
              <div className="py-6 text-center">
                <p className="font-medium">Nobody on your wishlists yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Join or create a wishlist to see people here.
                </p>
              </div>
            ) : (
              <ul>
                {people.map((person) => (
                  <li key={person.id}>
                    <Link
                      href={`/people/${person.id}`}
                      transitionTypes={['drill-in']}
                      className="flex min-h-14 items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-accent"
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={person.image ?? undefined} />
                        <AvatarFallback>{getInitials(person)}</AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {person.name ?? person.email}
                      </span>
                      <Badge
                        variant={
                          person.wishCount < 3 ? 'destructive' : 'secondary'
                        }
                      >
                        {person.wishCount} gift
                        {person.wishCount === 1 ? '' : 's'}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </PageContainer>
    </PageTransition>
  );
}
