import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import { getVisiblePeopleRefs } from '@/lib/db/queries-cached';
import { CreateEventWizard } from './create-event-wizard';

export default async function CreateSecretSantaPage() {
  // The participant list is loaded here rather than fetched from an effect in
  // the browser, so the wizard renders with its options already in place and
  // there is no read wearing the shape of a mutation.
  const viewer = await requireViewerOrRedirect();
  const people = await getVisiblePeopleRefs(viewer.id);

  return <CreateEventWizard people={people} />;
}
