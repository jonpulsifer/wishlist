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
    <CreateEventWizard
      families={families.map(({ id, name, memberships }) => ({
        id,
        name,
        members: memberships.map((m) => m.user),
      }))}
    />
  );
}
