'use client';

import { LogOut, Monitor, Moon, Settings, Sun, User } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/utils';

/** The fields the menu shows — the viewer's id stays on the server. */
type Account = { name: string | null; email: string; image: string | null };

/** Thumb-sized rows: a menu you can hit on an iPad without aiming. */
const itemClass = 'min-h-11 gap-3 px-3 text-base';

export function UserMenu({ user }: { user: Account }) {
  const { theme, setTheme } = useTheme();
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="flex size-11 shrink-0 items-center justify-center rounded-full outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=open]:bg-accent"
        >
          <Avatar className="size-9 border border-border">
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback className="text-sm font-semibold">
              {getInitials(user)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-60">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="size-9">
              <AvatarImage src={user.image ?? undefined} alt="" />
              <AvatarFallback className="text-sm font-semibold">
                {getInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate font-semibold">
                {user.name ?? user.email}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className={itemClass}>
          <Link href="/people/me">
            <User />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={itemClass}>
          <Link href="/people/me/edit">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={itemClass}>
            <ThemeIcon />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              className={itemClass}
              onClick={() => setTheme('light')}
            >
              <Sun />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              className={itemClass}
              onClick={() => setTheme('dark')}
            >
              <Moon />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              className={itemClass}
              onClick={() => setTheme('system')}
            >
              <Monitor />
              System
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={itemClass} onClick={() => signOut()}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserMenuSkeleton() {
  return (
    <div
      aria-hidden
      className="flex size-11 shrink-0 items-center justify-center"
    >
      <Skeleton className="size-9 rounded-full" />
    </div>
  );
}
