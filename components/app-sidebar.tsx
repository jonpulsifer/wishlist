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
  Settings,
  Shield,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from '@/components/ui/sidebar';
import { getInitials } from '@/lib/utils';

import santaIcon from '@/public/santaicon.png';

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

const getNextChristmas = () => {
  const today = new Date();
  const thisChristmas = new Date(today.getFullYear(), 11, 25); // month is 0-based
  return today > thisChristmas
    ? new Date(today.getFullYear() + 1, 11, 25)
    : thisChristmas;
};

function UserSection() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  const daysUntilChristmas = Math.floor(
    (getNextChristmas().getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const getChristmasEmoji = () => {
    if (daysUntilChristmas <= 0) return '🎄';
    if (daysUntilChristmas <= 7) return '🎁';
    if (daysUntilChristmas <= 30) return '⛄';
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

export function AppSidebar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === 'jonathan@pulsifer.ca';

  return (
    <Sidebar>
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
      <SidebarContent>
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
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin">
                      <Shield />
                      <span>Admin</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserSection />
      </SidebarFooter>
    </Sidebar>
  );
}
