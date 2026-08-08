import { PageContainer } from '@/components/shell/page-container';
import { PageTransition } from '@/components/shell/page-transition';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import ChristmasPlinko from './plinko';

export default async function PlinkoPage() {
  await requireViewerOrRedirect();

  return (
    <PageTransition>
      {/* The board wants every pixel and sets its own gutter, so the column
          gives back its padding and keeps only the FAB's clearance. */}
      <PageContainer wide className="p-0 pb-28 sm:p-0 sm:pb-28">
        <h1 className="px-2 pt-2 font-display text-2xl font-bold sm:px-4 sm:pt-4 sm:text-3xl">
          Plinko
        </h1>
        <ChristmasPlinko />
      </PageContainer>
    </PageTransition>
  );
}
