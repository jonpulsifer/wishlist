'use client';

import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from './dark-mode-toggle';

interface AppHeaderProps {
  children?: React.ReactNode;
}

export function AppHeader({ children }: AppHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex items-center gap-2 px-3 flex-1">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        {children}
      </div>
      <div className="flex items-center gap-2 px-3">
        <ModeToggle />
      </div>
    </header>
  );
}
