'use client';

/**
 * PROTOTYPE — throwaway, do not build on this.
 *
 * Question: should the app feel like a phone/tablet PWA instead of a sidebar
 * webapp? Three shell variants wrap the real authenticated pages on the
 * existing layout, switchable via ?variant= (current | a | b | c) and the
 * floating pill at the bottom. The choice sticks across navigation via
 * localStorage. `current` is today's sidebar shell, untouched.
 *
 *   a — Bottom tabs: iOS-style tab bar with a raised “+”, icon rail on tablet.
 *   b — Launcher: chrome-free pages, one big centre button opens a full-screen
 *       grid of giant tiles.
 *   c — Top chips: Material-style header with hero search and scrollable
 *       section chips, extended FAB.
 *
 * The “+” actions just link to /gifts — stubs, not wired to the add dialog.
 */

import {
  ArrowLeft,
  BookUser,
  Bot,
  CandyCane,
  ChevronLeft,
  ChevronRight,
  Gift,
  Home,
  LayoutGrid,
  ListCheck,
  Plus,
  User,
  Users,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { GlobalSearchTrigger } from '@/components/global-search/global-search-trigger';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { daysUntilChristmas } from '@/lib/season';
import { cn, getInitials } from '@/lib/utils';
import santaIcon from '@/public/santaicon.png';

const VARIANTS = [
  { key: 'current', name: "Today's shell" },
  { key: 'a', name: 'Bottom tabs' },
  { key: 'b', name: 'Launcher' },
  { key: 'c', name: 'Top chips' },
] as const;
type VariantKey = (typeof VARIANTS)[number]['key'];
const KEYS = VARIANTS.map((v) => v.key);
const STORAGE_KEY = 'pwa-shell-prototype-variant';

const DESTINATIONS = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'People', url: '/people', icon: Users },
  { title: 'Gifts', url: '/gifts', icon: Gift },
  { title: 'Claimed', url: '/claimed', icon: ListCheck },
  { title: 'My list', url: '/people/me', icon: User },
  { title: 'AI', url: '/ai', icon: Bot },
  { title: 'Secret Santa', url: '/secret-santa', icon: CandyCane },
  { title: 'Families', url: '/families', icon: BookUser },
];

function isActive(pathname: string, url: string) {
  if (url === '/') return pathname === '/' || pathname === '/home';
  return pathname === url || pathname.startsWith(`${url}/`);
}

function pageTitle(pathname: string) {
  const hit = [...DESTINATIONS]
    .sort((x, y) => y.url.length - x.url.length)
    .find((d) => isActive(pathname, d.url));
  if (hit) return hit.title;
  const seg = pathname.split('/')[1] ?? '';
  return seg ? seg[0].toUpperCase() + seg.slice(1) : 'Home';
}

function sleepsLabel() {
  const sleeps = daysUntilChristmas();
  return sleeps === 0 ? '🎄 Today!' : `${sleeps} sleeps 🎄`;
}

function SessionAvatar() {
  const { data: session } = useSession();
  if (!session?.user) return null;
  return (
    <Link href="/people/me" aria-label="My profile">
      <Avatar className="size-8">
        <AvatarImage
          src={session.user.image ?? undefined}
          alt={session.user.name || session.user.email}
        />
        <AvatarFallback className="text-xs">
          {getInitials(session.user)}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}

/** Full-screen tile grid — variant B's whole nav, variant A's overflow. */
function LauncherOverlay({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background/95 p-5 backdrop-blur-md">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-lg font-bold">{sleepsLabel()}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-11 items-center justify-center rounded-full border bg-card"
        >
          <X className="size-5" />
        </button>
      </div>
      <div className="grid flex-1 auto-rows-min grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
        {DESTINATIONS.map((d) => (
          <Link
            key={d.url}
            href={d.url}
            onClick={onClose}
            className={cn(
              'flex h-28 flex-col items-center justify-center gap-2 rounded-2xl border bg-card font-medium shadow-sm active:scale-95',
              isActive(pathname, d.url) &&
                'border-primary bg-primary/10 text-primary',
            )}
          >
            <d.icon className="size-7" />
            {d.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

/** A — bottom tab bar on phones, icon rail on md+. */
function VariantTabs({
  pathname,
  children,
}: {
  pathname: string;
  children: React.ReactNode;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const tabs = DESTINATIONS.slice(0, 2); // Home, People
  const rightTabs = [DESTINATIONS[3]]; // Claimed
  return (
    <div className="flex min-h-svh w-full flex-col [&_[data-app-header]]:hidden">
      <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
        <Image src={santaIcon.src} width={24} height={24} alt="" />
        <span className="font-semibold">{pageTitle(pathname)}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {sleepsLabel()}
        </span>
        <GlobalSearchTrigger variant="icon" className="size-9" />
      </header>

      {/* Tablet: icon rail instead of tabs. */}
      <nav className="fixed inset-y-0 left-0 z-20 hidden w-16 flex-col items-center gap-1 border-r bg-background pt-16 md:flex">
        {DESTINATIONS.map((d) => (
          <Link
            key={d.url}
            href={d.url}
            className={cn(
              'flex w-14 flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] text-muted-foreground hover:bg-accent',
              isActive(pathname, d.url) && 'bg-primary/10 text-primary',
            )}
          >
            <d.icon className="size-5" />
            {d.title}
          </Link>
        ))}
      </nav>

      <div className="flex flex-1 flex-col pb-20 md:pb-4 md:pl-16">
        {children}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid h-16 grid-cols-5 items-center">
          {tabs.map((d) => (
            <TabItem key={d.url} d={d} pathname={pathname} />
          ))}
          <Link
            href="/gifts"
            aria-label="Add a wish"
            className="mx-auto -mt-6 flex size-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95"
          >
            <Plus className="size-6" />
          </Link>
          {rightTabs.map((d) => (
            <TabItem key={d.url} d={d} pathname={pathname} />
          ))}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex h-full flex-col items-center justify-center gap-0.5 text-[10px] text-muted-foreground"
          >
            <LayoutGrid className="size-5" />
            More
          </button>
        </div>
      </nav>
      {moreOpen && (
        <LauncherOverlay
          pathname={pathname}
          onClose={() => setMoreOpen(false)}
        />
      )}
    </div>
  );
}

function TabItem({
  d,
  pathname,
}: {
  d: (typeof DESTINATIONS)[number];
  pathname: string;
}) {
  return (
    <Link
      href={d.url}
      className={cn(
        'flex h-full flex-col items-center justify-center gap-0.5 text-[10px] text-muted-foreground',
        isActive(pathname, d.url) && 'text-primary',
      )}
    >
      <d.icon className="size-5" />
      {d.title}
    </Link>
  );
}

/** B — chrome-free pages, one big launcher button. */
function VariantLauncher({
  pathname,
  children,
}: {
  pathname: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const atHome = pathname === '/' || pathname === '/home';
  return (
    <div className="flex min-h-svh w-full flex-col [&_[data-app-header]]:hidden">
      <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
        {atHome ? (
          <Image src={santaIcon.src} width={24} height={24} alt="" />
        ) : (
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="flex size-9 items-center justify-center rounded-full hover:bg-accent"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
        <span className="font-semibold">{pageTitle(pathname)}</span>
        <div className="ml-auto flex items-center gap-2">
          <GlobalSearchTrigger variant="icon" className="size-9" />
          <SessionAvatar />
        </div>
      </header>
      <div className="flex flex-1 flex-col pb-24">{children}</div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="fixed bottom-5 left-1/2 z-30 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl active:scale-95"
      >
        <Gift className="size-6" />
      </button>
      {open && (
        <LauncherOverlay pathname={pathname} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

/** C — big top bar with hero search and section chips, extended FAB. */
function VariantChips({
  pathname,
  children,
}: {
  pathname: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh w-full flex-col [&_[data-app-header]]:hidden">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 pb-2 pt-3">
          <div className="flex items-center gap-2">
            <Image src={santaIcon.src} width={28} height={28} alt="" />
            <span className="text-lg font-bold">wishin.app</span>
            <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {sleepsLabel()}
            </span>
            <SessionAvatar />
          </div>
          <GlobalSearchTrigger variant="hero" className="h-11" />
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
            {DESTINATIONS.map((d) => (
              <Link
                key={d.url}
                href={d.url}
                className={cn(
                  'flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm',
                  isActive(pathname, d.url)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent',
                )}
              >
                <d.icon className="size-4" />
                {d.title}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col pb-24">
        {children}
      </div>
      <Link
        href="/gifts"
        className="fixed bottom-6 right-5 z-30 flex h-12 items-center gap-2 rounded-full bg-primary px-5 font-medium text-primary-foreground shadow-lg active:scale-95"
      >
        <Plus className="size-5" />
        Add wish
      </Link>
    </div>
  );
}

function Switcher({
  variant,
  onCycle,
}: {
  variant: VariantKey;
  onCycle: (dir: 1 | -1) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      )
        return;
      if (e.key === 'ArrowLeft') onCycle(-1);
      if (e.key === 'ArrowRight') onCycle(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCycle]);

  const { name } = VARIANTS.find((v) => v.key === variant) ?? VARIANTS[0];
  return (
    <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 px-1.5 py-1 text-zinc-50 shadow-2xl">
      <button
        type="button"
        onClick={() => onCycle(-1)}
        aria-label="Previous variant"
        className="flex size-8 items-center justify-center rounded-full hover:bg-white/10"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="min-w-40 text-center font-mono text-xs">
        {variant} — {name}
      </span>
      <button
        type="button"
        onClick={() => onCycle(1)}
        aria-label="Next variant"
        className="flex size-8 items-center justify-center rounded-full hover:bg-white/10"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

export function PwaShellPrototype({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = searchParams.get('variant');
  const [variant, setVariant] = useState<VariantKey>(
    param && KEYS.includes(param as VariantKey)
      ? (param as VariantKey)
      : 'current',
  );

  useEffect(() => {
    if (param && KEYS.includes(param as VariantKey)) {
      setVariant(param as VariantKey);
      localStorage.setItem(STORAGE_KEY, param);
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && KEYS.includes(saved as VariantKey))
        setVariant(saved as VariantKey);
    }
  }, [param]);

  const current = (
    <>
      {sidebar}
      <main className="flex flex-1">{children}</main>
    </>
  );

  if (process.env.NODE_ENV === 'production') return current;

  const cycle = (dir: 1 | -1) => {
    const next =
      KEYS[(KEYS.indexOf(variant) + dir + KEYS.length) % KEYS.length];
    localStorage.setItem(STORAGE_KEY, next);
    router.replace(`${pathname}?variant=${next}`);
    setVariant(next);
  };

  return (
    <>
      {variant === 'current' && current}
      {variant === 'a' && (
        <VariantTabs pathname={pathname}>{children}</VariantTabs>
      )}
      {variant === 'b' && (
        <VariantLauncher pathname={pathname}>{children}</VariantLauncher>
      )}
      {variant === 'c' && (
        <VariantChips pathname={pathname}>{children}</VariantChips>
      )}
      <Switcher variant={variant} onCycle={cycle} />
    </>
  );
}
