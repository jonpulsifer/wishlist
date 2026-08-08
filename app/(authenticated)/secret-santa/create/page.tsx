import { PageContainer } from '@/components/shell/page-container';
import { PageHeader } from '@/components/shell/page-header';
import { PageTransition } from '@/components/shell/page-transition';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getFamiliesWithMembers } from '@/lib/db/queries-cached';
import { CreateEventWizard } from './create-event-wizard';

export default async function CreateSecretSantaPage() {
  // The options are loaded here rather than fetched from an effect in the
  // browser, so the wizard renders with them already in place and there is no
  // read wearing the shape of a mutation.
  const viewer = await requireViewerOrRedirect();
  const families = await getFamiliesWithMembers(viewer.id);

  return (
    <PageTransition>
      <PageContainer>
        <div className="flex flex-col gap-2">
          <PageHeader
            title="Create Secret Santa"
            backHref="/secret-santa"
            backLabel="Secret Santa"
          />
          <p className="text-muted-foreground text-sm sm:text-base">
            Set up a new Secret Santa event for your friends and family.
          </p>
        </div>

        <CreateEventWizard
          families={families.map(({ id, name, memberships }) => ({
            id,
            name,
            members: memberships.map((m) => m.user),
          }))}
        />
      </PageContainer>
    </PageTransition>
  );
}
