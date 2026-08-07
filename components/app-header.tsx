'use client';

import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import santaIcon from '@/public/santaicon.png';
import { GlobalSearchTrigger } from './global-search/global-search-trigger';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

interface AppHeaderProps {
  children?: React.ReactNode;
}

export function AppHeader({ children }: AppHeaderProps) {
  const isMobile = useIsMobile();
  return (
    <header
      data-app-header
      className="flex h-16 shrink-0 items-center p-2 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <SidebarTrigger />
      <Separator
        orientation="vertical"
        className="mr-1 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex flex-row items-center gap-2 text-sm">
              {isMobile && (
                <Image
                  src={santaIcon.src}
                  width={24}
                  height={24}
                  alt="wishin.app"
                  className="shrink-0"
                />
              )}
              {!isMobile && (
                <span className="font-semibold text-sm">wishin.app</span>
              )}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
      <div className="block sm:hidden">
        <GlobalSearchTrigger variant="icon" />
      </div>
      <div className="hidden sm:block">
        <GlobalSearchTrigger variant="header" />
      </div>
    </header>
  );
}
