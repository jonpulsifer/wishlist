'use client';

import {
  BookUser,
  Bot,
  CandyCane,
  Gift,
  Home,
  ListCheck,
  LogOut,
  Settings,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback className="text-xs">
              {getInitials(session.user)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name || session.user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
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
  );
}

function FunSection() {
  const daysUntilChristmas = Math.floor(
    (getNextChristmas().getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const getChristmasEmoji = () => {
    if (daysUntilChristmas <= 0) return '🎄';
    if (daysUntilChristmas <= 7) return '🎁';
    if (daysUntilChristmas <= 30) return '⛄';
    return '🎅';
  };

  const getChristmasMessage = () => {
    if (daysUntilChristmas <= 0) return "It's Christmas!";
    if (daysUntilChristmas === 1) return 'Christmas is tomorrow!';
    if (daysUntilChristmas <= 7) return `${daysUntilChristmas} days to go!`;
    if (daysUntilChristmas <= 30) {
      return `${daysUntilChristmas} days until Christmas`;
    }
    return `${daysUntilChristmas} days until Christmas`;
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-lg">{getChristmasEmoji()}</span>
      <div className="flex flex-col">
        <span className="font-medium">{getChristmasMessage()}</span>
        <span className="text-xs text-muted-foreground">
          <Sparkles className="inline h-3 w-3 mr-1" />
          Holiday spirit mode
        </span>
      </div>
    </div>
  );
}

export function AppSidebar() {
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2">
            <FunSection />
            <UserSection />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
