'use client';

import { RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { PageContainer } from '@/components/shell/page-container';
import { Button } from '@/components/ui/button';

export default function AuthenticatedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PageContainer>
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
        <span className="text-6xl" role="img" aria-label="A reindeer">
          🦌
        </span>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          A reindeer stood on the wiring
        </h1>
        <p className="text-muted-foreground">
          Something on this page did not load. Nothing you have added is lost —
          try again, and if it keeps happening take the long way round.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} className="min-h-11 px-6 text-base">
            <RotateCcw />
            Try again
          </Button>
          <Button asChild variant="outline" className="min-h-11 px-6 text-base">
            <Link href="/home">Back to Home</Link>
          </Button>
        </div>
        {error.digest && (
          <p className="font-mono text-xs text-muted-foreground">
            {error.digest}
          </p>
        )}
      </div>
    </PageContainer>
  );
}
