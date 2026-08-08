import { PageContainer } from '@/components/shell/page-container';
import { PageTransition } from '@/components/shell/page-transition';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Every route's `loading.tsx`. Same gutters as the real page, so the content
 * lands where the pulse was rather than jumping down the screen. Wrapped in
 * `PageTransition` because on a drill-in the skeleton is the element that
 * enters — without it, only the leaving page's half of the slide plays.
 */
export function PageSkeleton({
  rows = 4,
  wide,
}: {
  rows?: number;
  wide?: boolean;
}) {
  return (
    <PageTransition>
      <PageContainer wide={wide}>
        <Skeleton className="h-9 w-52" />
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-xl" />
        ))}
        <span className="sr-only">Loading</span>
      </PageContainer>
    </PageTransition>
  );
}
