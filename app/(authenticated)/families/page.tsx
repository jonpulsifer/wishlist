import { Suspense } from 'react';
import { PageContainer } from '@/components/shell/page-container';
import { PageTransition } from '@/components/shell/page-transition';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getFamiliesWithMembers } from '@/lib/db/queries-cached';
import { CreateFamilyButton } from './family-actions';
import { FamilyCard } from './family-card';

export default async function FamiliesPage() {
  const viewer = await requireViewerOrRedirect();

  return (
    <PageTransition>
      <PageContainer>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              Families
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              The families you are in, and who else is in them.
            </p>
          </div>
          <CreateFamilyButton />
        </div>

        <Suspense fallback={<FamiliesLoading />}>
          <FamiliesContent userId={viewer.id} />
        </Suspense>
      </PageContainer>
    </PageTransition>
  );
}

function FamiliesLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <div className="h-7 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          <div className="h-20 bg-muted/50 rounded animate-pulse mt-4" />
          <div className="h-10 bg-muted rounded animate-pulse mt-4" />
        </div>
      ))}
    </div>
  );
}

async function FamiliesContent({ userId }: { userId: string }) {
  const families = await getFamiliesWithMembers(userId);

  if (families.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          You are not in any families yet. Start one, or follow an invite link.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {families.map((family) => (
        <FamilyCard key={family.id} family={family} />
      ))}
    </div>
  );
}
