'use client';

import { SearchIcon } from 'lucide-react';
import { useGlobalSearch } from '@/components/global-search/global-search-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type GlobalSearchTriggerProps = {
  className?: string;
  variant?: 'header' | 'hero' | 'icon';
};

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}

export function GlobalSearchTrigger({
  className,
  variant = 'header',
}: GlobalSearchTriggerProps) {
  const { setOpen } = useGlobalSearch();

  if (variant === 'icon') {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn('shrink-0', className)}
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    );
  }

  if (variant === 'hero') {
    return (
      <Button
        type="button"
        variant="secondary"
        className={cn(
          'h-12 w-full justify-between rounded-xl border bg-background/60 px-4 text-sm font-normal text-muted-foreground hover:bg-accent/30',
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4" />
          Search gifts, people, wishlists…
        </span>
        <span className="hidden items-center gap-1 sm:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        'h-9 w-full justify-between gap-2 px-3 text-sm sm:w-[280px]',
        className,
      )}
      onClick={() => setOpen(true)}
    >
      <span className="flex items-center gap-2 text-muted-foreground">
        <SearchIcon className="h-4 w-4" />
        Search…
      </span>
      <span className="hidden items-center gap-1 sm:flex">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </Button>
  );
}
