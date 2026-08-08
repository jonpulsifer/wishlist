import { Bot } from 'lucide-react';
import { PageContainer } from '@/components/shell/page-container';
import { PageTransition } from '@/components/shell/page-transition';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getPeopleForNewWishModal } from '@/lib/db/queries-cached';
import { AIRecommendations } from './ai-recommendations';

export default async function AIPage() {
  const viewer = await requireViewerOrRedirect();

  const people = await getPeopleForNewWishModal(viewer.id);

  return (
    <PageTransition>
      <PageContainer>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 shrink-0 text-purple-500" />
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              AI Gift Recommendations
            </h1>
          </div>
          <p className="text-muted-foreground">
            Get personalized gift suggestions powered by AI based on someone's
            wishlist history (including archived gifts)
          </p>
        </div>

        <AIRecommendations people={people} />
      </PageContainer>
    </PageTransition>
  );
}
