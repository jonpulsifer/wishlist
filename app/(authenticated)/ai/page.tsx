import { Bot } from 'lucide-react';
import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset } from '@/components/ui/sidebar';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getPeopleForNewGiftModal } from '@/lib/db/queries-cached';
import { AIRecommendations } from './ai-recommendations';

export default async function AIPage() {
  const viewer = await requireViewerOrRedirect();

  const people = await getPeopleForNewGiftModal(viewer.id);

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>AI Gift Recommendations</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <AppContent>
        {/* Header */}
        <div className="relative">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-purple-500" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                AI Gift Recommendations
              </h1>
            </div>
            <p className="text-muted-foreground">
              Get personalized gift suggestions powered by AI based on someone's
              wishlist history (including archived gifts)
            </p>
          </div>
        </div>

        {/* AI Recommendations Component */}
        <AIRecommendations people={people} />
      </AppContent>
    </SidebarInset>
  );
}
