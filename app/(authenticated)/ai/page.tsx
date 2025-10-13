import { Bot } from 'lucide-react';
import { unauthorized } from 'next/navigation';
import { getSession } from '@/app/auth';
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
import { getPeopleForNewGiftModal } from '@/lib/db/queries-cached';
import { AIRecommendations } from './ai-recommendations';

export default async function AIPage() {
  const { user } = await getSession();
  if (!user?.id) {
    return unauthorized();
  }

  const people = await getPeopleForNewGiftModal(user.id);

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
      <div className="flex flex-1 flex-col gap-6 p-4 max-w-full overflow-hidden">
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
      </div>
    </SidebarInset>
  );
}
