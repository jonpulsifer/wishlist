'use client';

import {
  BookUserIcon,
  GiftIcon,
  HomeIcon,
  Loader2Icon,
  UserIcon,
  UsersIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useGlobalSearch } from '@/components/global-search/global-search-provider';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useDebounce } from '@/hooks/use-debounce';

type SearchItem = {
  id: string;
  type: 'user' | 'gift' | 'wishlist' | 'nav';
  title: string;
  subtitle?: string | null;
  href: string;
};

type SearchResponse = {
  users: SearchItem[];
  gifts: SearchItem[];
  wishlists: SearchItem[];
};

const EMPTY_RESULTS: SearchResponse = { users: [], gifts: [], wishlists: [] };

function iconForType(type: SearchItem['type']) {
  switch (type) {
    case 'gift':
      return <GiftIcon className="h-4 w-4" />;
    case 'wishlist':
      return <BookUserIcon className="h-4 w-4" />;
    case 'user':
      return <UsersIcon className="h-4 w-4" />;
    case 'nav':
      return <HomeIcon className="h-4 w-4" />;
  }
}

export function GlobalSearchDialog() {
  const router = useRouter();
  const { open, setOpen } = useGlobalSearch();

  const [query, setQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<SearchResponse>(EMPTY_RESULTS);

  const debouncedSearch = useDebounce(async (value: string) => {
    const q = value.trim();
    if (q.length < 2) {
      setResults(EMPTY_RESULTS);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        setResults(EMPTY_RESULTS);
        return;
      }
      const data = (await res.json()) as SearchResponse;
      setResults(data);
    } catch {
      setResults(EMPTY_RESULTS);
    } finally {
      setLoading(false);
    }
  }, 200);

  React.useEffect(() => {
    if (!open) {
      setQuery('');
      setResults(EMPTY_RESULTS);
      setLoading(false);
    }
  }, [open]);

  const quickLinks: SearchItem[] = React.useMemo(
    () => [
      { id: 'nav-home', type: 'nav', title: 'Home', href: '/home' },
      { id: 'nav-gifts', type: 'nav', title: 'Gifts', href: '/gifts' },
      { id: 'nav-people', type: 'nav', title: 'People', href: '/people' },
      {
        id: 'nav-wishlists',
        type: 'nav',
        title: 'Wishlists',
        href: '/wishlists',
      },
      { id: 'nav-me', type: 'nav', title: 'My profile', href: '/people/me' },
    ],
    [],
  );

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const hasAnyResults =
    results.users.length > 0 ||
    results.gifts.length > 0 ||
    results.wishlists.length > 0;

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        value={query}
        onValueChange={(value) => {
          setQuery(value);
          debouncedSearch(value);
        }}
        placeholder="Search gifts, people, wishlists…"
        autoFocus
      />
      <CommandList>
        {query.trim().length < 2 ? (
          <>
            <CommandGroup heading="Start here">
              <CommandItem onSelect={() => handleSelect('/gifts')}>
                <GiftIcon className="mr-2 h-4 w-4" />
                Browse gifts
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/people')}>
                <UsersIcon className="mr-2 h-4 w-4" />
                Browse people
              </CommandItem>
              <CommandItem onSelect={() => handleSelect('/wishlists')}>
                <BookUserIcon className="mr-2 h-4 w-4" />
                Browse wishlists
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tip">
              <CommandItem
                onSelect={() => {
                  // no-op; it's a tip row
                }}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Type at least 2 characters to search everything
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
              {quickLinks.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.title}
                  onSelect={() => handleSelect(item.href)}
                >
                  <span className="mr-2">{iconForType(item.type)}</span>
                  <span className="flex-1 truncate">{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        ) : (
          <>
            {loading && (
              <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Searching…
              </div>
            )}

            {!loading && !hasAnyResults && (
              <CommandEmpty>No results.</CommandEmpty>
            )}

            {results.gifts.length > 0 && (
              <CommandGroup heading="Gifts">
                {results.gifts.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.subtitle ?? ''}`}
                    onSelect={() => handleSelect(item.href)}
                  >
                    <GiftIcon className="mr-2 h-4 w-4" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{item.title}</div>
                      {item.subtitle && (
                        <div className="truncate text-xs text-muted-foreground">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {results.users.length > 0 && (
              <>
                {results.gifts.length > 0 && <CommandSeparator />}
                <CommandGroup heading="People">
                  {results.users.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.title} ${item.subtitle ?? ''}`}
                      onSelect={() => handleSelect(item.href)}
                    >
                      <UsersIcon className="mr-2 h-4 w-4" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{item.title}</div>
                        {item.subtitle && (
                          <div className="truncate text-xs text-muted-foreground">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {results.wishlists.length > 0 && (
              <>
                {(results.gifts.length > 0 || results.users.length > 0) && (
                  <CommandSeparator />
                )}
                <CommandGroup heading="Wishlists">
                  {results.wishlists.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.title} ${item.subtitle ?? ''}`}
                      onSelect={() => handleSelect(item.href)}
                    >
                      <BookUserIcon className="mr-2 h-4 w-4" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{item.title}</div>
                        {item.subtitle && (
                          <div className="truncate text-xs text-muted-foreground">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
