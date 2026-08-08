'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useEffect, useRef, useState } from 'react';
import { GlobalSearchTrigger } from '@/components/global-search/global-search-trigger';
import { ChipsNav, ChipsRow } from '@/components/shell/chips-nav';
import { daysUntilChristmas } from '@/lib/season';
import { cn } from '@/lib/utils';
import santaIcon from '@/public/santaicon.png';

export function AppShell({
  children,
  user,
  fab,
}: {
  children: React.ReactNode;
  user: React.ReactNode;
  fab: React.ReactNode;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) =>
      setScrolled(!entry.isIntersecting),
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <div ref={sentinelRef} aria-hidden className="h-px shrink-0" />
      <header
        // Named so the header holds still while the page slides under it.
        style={{ viewTransitionName: 'site-header' }}
        className={cn(
          // Static below 34rem viewport height: a sticky box taller than the
          // scrollport can never reveal its bottom row.
          'sticky top-0 z-40 border-b border-transparent bg-background/85 pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] backdrop-blur-md transition-colors duration-200 [@media(max-height:34rem)]:static',
          scrolled && 'border-border shadow-sm',
        )}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 pb-1 sm:px-6">
          <div className="flex min-h-14 items-center gap-3">
            <Link
              href="/home"
              className="flex min-h-11 min-w-0 items-center gap-2 rounded-full pr-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <Image
                src={santaIcon}
                alt=""
                width={32}
                height={32}
                className="size-8 shrink-0"
                priority
              />
              <span className="truncate font-display text-lg font-semibold tracking-tight">
                wishin.app
              </span>
            </Link>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <CountdownPill />
              {user}
            </div>
          </div>

          <GlobalSearchTrigger variant="hero" />

          {/* usePathname suspends on unknown dynamic params; the fallback row
              keeps all eight chips in every route's static shell. */}
          <Suspense fallback={<ChipsRow current={-1} />}>
            <ChipsNav />
          </Suspense>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
      {fab}
    </div>
  );
}

function emojiFor(days: number) {
  if (days <= 0) return '🎄';
  if (days <= 7) return '🎁';
  if (days <= 30) return '⛄';
  return '🎅';
}

/** The small echo of the home page's countdown, on every screen. */
function CountdownPill() {
  const [days, setDays] = useState<number | null>(null);

  // After mount, not during render: `new Date()` is a blocking read under Cache
  // Components, and the server's midnight is not the viewer's.
  useEffect(() => setDays(daysUntilChristmas()), []);

  if (days === null) {
    return (
      <span
        aria-hidden
        className="h-8 w-28 animate-pulse rounded-full bg-accent"
      />
    );
  }

  const noun = days === 1 ? 'sleep' : 'sleeps';
  return (
    <span className="inline-flex min-w-28 items-center justify-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground tabular-nums">
      {days <= 0 ? (
        <>
          <span aria-hidden>🎄</span>Merry Christmas!
        </>
      ) : (
        <>
          <span aria-hidden>{emojiFor(days)}</span>
          <span>{days}</span>
          <span>{noun}</span>
          <span className="sr-only">until Christmas</span>
        </>
      )}
    </span>
  );
}
