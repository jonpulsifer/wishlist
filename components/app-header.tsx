'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import santaIcon from '@/public/santaicon.png';

interface AppHeaderProps {
  children?: React.ReactNode;
}

export function AppHeader({ children }: AppHeaderProps) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Show logo on mobile OR when sidebar is collapsed on desktop
  const showLogo = isMobile || isCollapsed;

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex items-center gap-2 px-3 flex-1 min-w-0 overflow-hidden">
        <SidebarTrigger className="shrink-0" />
        <Separator orientation="vertical" className="mr-2 h-4 shrink-0" />
        {showLogo && (
          <>
            <div className="flex items-center gap-2 shrink-0">
              <Image
                src={santaIcon.src}
                width={24}
                height={24}
                alt="wishin.app"
                className="shrink-0"
              />
              <span className="font-semibold text-sm hidden sm:inline">
                wishin.app
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </>
        )}
        <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </header>
  );
}
