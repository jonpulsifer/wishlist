'use client';

import {
  BookUser,
  Bot,
  CandyCane,
  ChevronLeft,
  ChevronRight,
  Gift,
  Home,
  ListCheck,
  User,
  Users,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/** Order is the map: the index delta decides which way a page slides. */
const sections = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/people', label: 'People', icon: Users },
  { href: '/gifts', label: 'Gifts', icon: Gift },
  { href: '/claimed', label: 'Claimed', icon: ListCheck },
  { href: '/people/me', label: 'My list', icon: User },
  { href: '/ai', label: 'AI', icon: Bot },
  { href: '/secret-santa', label: 'Secret Santa', icon: CandyCane },
  { href: '/families', label: 'Families', icon: BookUser },
];

/**
 * Longest matching prefix wins, so `/people/me/edit` lights "My list" rather
 * than "People", and `/gifts/[id]` still lights "Gifts". `-1` for a route with
 * no chip, such as `/plinko`.
 */
function activeIndex(pathname: string) {
  let best = -1;
  sections.forEach((section, index) => {
    const matches =
      pathname === section.href || pathname.startsWith(`${section.href}/`);
    if (!matches) return;
    if (best === -1 || section.href.length > sections[best].href.length) {
      best = index;
    }
  });
  return best;
}

/**
 * On routes with unknown dynamic params `usePathname` suspends during
 * prerender, so the pathname read lives in this thin wrapper and `AppShell`
 * mounts it behind `<Suspense fallback={<ChipsRow current={-1} />}>` — the
 * eight chips reach every static shell; only the active pill waits for resume.
 */
export function ChipsNav() {
  const pathname = usePathname();
  return <ChipsRow current={activeIndex(pathname)} />;
}

export function ChipsRow({ current }: { current: number }) {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState({ start: false, end: false });

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const remaining =
      scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft;
    const start = scroller.scrollLeft > 1;
    const end = remaining > 1;
    setOverflow((prev) =>
      prev.start === start && prev.end === end ? prev : { start, end },
    );
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return;
    measure();
    scroller.addEventListener('scroll', measure, { passive: true });
    // The track as well as the scroller: a webfont swap changes how wide the
    // chips are without changing the box they scroll inside.
    const resize = new ResizeObserver(measure);
    resize.observe(scroller);
    resize.observe(track);
    return () => {
      scroller.removeEventListener('scroll', measure);
      resize.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    const chip = scrollerRef.current?.querySelector('[aria-current="page"]');
    chip?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [current, reduceMotion]);

  const nudge = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({
      left: direction * scroller.clientWidth * 0.7,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <nav aria-label="Sections" className="relative">
      <motion.div
        layoutScroll
        ref={scrollerRef}
        className="scrollbar-none flex snap-x snap-proximity scroll-px-12 overflow-x-auto overscroll-x-contain py-2"
      >
        <div ref={trackRef} className="flex gap-2">
          {sections.map((section, index) => {
            const isActive = index === current;
            return (
              <Link
                key={section.href}
                href={section.href}
                transitionTypes={[
                  index > current ? 'section-forward' : 'section-back',
                ]}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-11 shrink-0 snap-start items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  // The active chip carries its own fill so the label never
                  // depends on where the sliding pill is mid-flight.
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent/60 text-accent-foreground hover:bg-accent',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="chips-nav-pill"
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-primary shadow-sm"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: 'spring', stiffness: 420, damping: 38 }
                    }
                  />
                )}
                <section.icon className="relative size-4 shrink-0" />
                <span className="relative">{section.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>

      <EdgeControl side="start" shown={overflow.start} onScroll={nudge} />
      <EdgeControl side="end" shown={overflow.end} onScroll={nudge} />
    </nav>
  );
}

/**
 * The fade says there is more; the button is how you get there without knowing
 * you may swipe. Both appear only while that side actually overflows.
 */
function EdgeControl({
  side,
  shown,
  onScroll,
}: {
  side: 'start' | 'end';
  shown: boolean;
  onScroll: (direction: 1 | -1) => void;
}) {
  const isStart = side === 'start';
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-y-0 flex w-16 items-center transition-opacity duration-200',
        isStart
          ? 'left-0 justify-start bg-gradient-to-r'
          : 'right-0 justify-end bg-gradient-to-l',
        'from-background via-background/85 to-transparent',
        shown ? 'opacity-100' : 'opacity-0',
      )}
    >
      <button
        type="button"
        tabIndex={shown ? 0 : -1}
        aria-hidden={!shown}
        aria-label={isStart ? 'Scroll sections left' : 'Scroll sections right'}
        onClick={() => onScroll(isStart ? -1 : 1)}
        className={cn(
          'pointer-events-auto flex size-11 items-center justify-center rounded-full border bg-background text-foreground shadow-md outline-none transition-transform hover:bg-accent active:scale-95 focus-visible:ring-[3px] focus-visible:ring-ring/50',
          !shown && 'pointer-events-none',
        )}
      >
        {isStart ? (
          <ChevronLeft className="size-5" />
        ) : (
          <ChevronRight className="size-5" />
        )}
      </button>
    </div>
  );
}
