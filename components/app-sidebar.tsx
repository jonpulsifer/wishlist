'use client';

import {
  BookUser,
  Bot,
  CandyCane,
  ChevronsUpDown,
  Gift,
  Home,
  ListCheck,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Suspense } from 'react';
import { SnowfallBackground } from '@/components/snowfall-background';
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
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { christmasProgress, daysUntilChristmas } from '@/lib/season';
import { getInitials } from '@/lib/utils';
import santaIcon from '@/public/santaicon.png';

/** Counts only — the shape crossing from the server layout must serialise. */
export type SidebarProgress = {
  sorted: number;
  total: number;
  percent: number;
};

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'People',
    url: '/people',
    icon: Users,
  },
  {
    title: 'Gifts',
    url: '/gifts',
    icon: Gift,
  },
  {
    title: 'Claimed',
    url: '/claimed',
    icon: ListCheck,
  },
  {
    title: 'AI',
    url: '/ai',
    icon: Bot,
  },
  {
    title: 'Secret Santa',
    url: '/secret-santa',
    icon: CandyCane,
  },
  {
    title: 'Wishlists',
    url: '/wishlists',
    icon: BookUser,
  },
];

function UserSection() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  if (!session?.user) {
    return null;
  }

  const getChristmasEmoji = () => {
    const days = daysUntilChristmas();
    if (days <= 0) return '🎄';
    if (days <= 7) return '🎁';
    if (days <= 30) return '⛄';
    return '🎅';
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={session.user.image ?? undefined}
                  alt={session.user.name || session.user.email}
                />
                <AvatarFallback className="rounded-lg text-xs">
                  {getInitials(session.user)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session.user.name || session.user.email}
                </span>
                <span className="truncate text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-base">{getChristmasEmoji()}</span>
                  <span>Holiday spirit</span>
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session.user.image ?? undefined}
                    alt={session.user.name || session.user.email}
                  />
                  <AvatarFallback className="rounded-lg text-xs">
                    {getInitials(session.user)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session.user.name || session.user.email}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/people/me">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/people/me/edit">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                {theme === 'light' ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : theme === 'dark' ? (
                  <Moon className="mr-2 h-4 w-4" />
                ) : (
                  <Monitor className="mr-2 h-4 w-4" />
                )}
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="mr-2 h-4 w-4" />
                  <span>System</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/** The countdown, in the one place that is on every screen. */
function ChristmasPanel({ sorted, total }: SidebarProgress) {
  const days = daysUntilChristmas();
  const left = total - sorted;
  return (
    // Hidden when the rail collapses to icons — there is no room for prose.
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupContent className="rounded-lg bg-sidebar-accent/60 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-semibold">
            {days === 0 ? '🎄 Today!' : `${days} sleep${days === 1 ? '' : 's'}`}
          </span>
          <span className="text-xs text-sidebar-foreground/70">
            till Christmas
          </span>
        </div>
        <ProgressBar
          value={christmasProgress()}
          label="Progress through the year to Christmas"
          className="mt-2 bg-sidebar-border"
          fillClassName="bg-sidebar-primary"
        />
        {total > 0 && (
          <p className="mt-2 text-xs text-sidebar-foreground/70">
            {left === 0 ? 'Everyone covered 🎉' : `${left} left to shop for`}
          </p>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar({ progress }: { progress: SidebarProgress }) {
  const { data: session } = useSession();
  // The session carries capabilities, not roles — resolved server-side against
  // the same table the pages gate on, so the link and the page agree.
  const showAdminButton = session?.user?.capabilities?.includes('view:admin');

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/home">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-transparent text-sidebar-primary-foreground dark:text-sidebar-primary-foreground">
                  <Image
                    src={santaIcon.src}
                    width={32}
                    height={32}
                    alt="wishin.app"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">wishin.app</span>
                  <span className="text-xs text-muted-foreground">
                    Making wishes come true
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Snow lives here and only here: over the sidebar's own background it
          is actually visible, and it stays out of the way of the content. */}
      <SidebarContent className="relative">
        <SnowfallBackground
          contained
          intensity="light"
          showBackground={false}
        />
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {showAdminButton && (
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin">
                      <Shield />
                      <span>Admin</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/admin/secret-santa">
                          <CandyCane />
                          <span>Secret Santa</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild>
                        <a href="/admin/roles">
                          <Users />
                          <span>Roles</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        <ChristmasPanel {...progress} />
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<div>Loading...</div>}>
          <UserSection />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
