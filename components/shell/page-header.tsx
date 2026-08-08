import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * A detail page's chrome: where you came from, what you are looking at, and
 * what you can do to it. The back link is labelled with its destination —
 * a bare chevron makes you remember.
 */
export function PageHeader({
  title,
  backHref,
  backLabel = 'Back',
  actions,
  className,
}: {
  title: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {backHref && (
        <Link
          href={backHref}
          transitionTypes={['drill-out']}
          className="-ml-2 inline-flex min-h-11 w-fit items-center gap-1 rounded-full pr-3 pl-1 text-sm font-semibold text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <ChevronLeft className="size-5 shrink-0" />
          {backLabel}
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="min-w-0 font-display text-2xl font-bold sm:text-3xl">
          {title}
        </h1>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
