import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/shell/page-container';
import { PageHeader } from '@/components/shell/page-header';
import { PageTransition } from '@/components/shell/page-transition';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';
import {
  getOwnExclusions,
  getOwnProfile,
  getVisiblePeopleRefs,
} from '@/lib/db/queries-cached';
import { ExclusionsForm } from './exclusions-form';
import { UserDetailsForm } from './user-details-form';

export default async function EditUserPage() {
  const viewer = await requireViewerOrRedirect();
  const [user, excluded, people] = await Promise.all([
    getOwnProfile(viewer.id),
    getOwnExclusions(viewer.id),
    getVisiblePeopleRefs(viewer.id),
  ]);
  if (!user) {
    notFound();
  }

  return (
    <PageTransition>
      <PageContainer className="max-w-2xl">
        <PageHeader
          backHref="/people/me"
          backLabel="My list"
          title="Edit profile"
        />
        <div>
          <UserDetailsForm user={user} />
          <ExclusionsForm
            people={people.filter((person) => person.id !== viewer.id)}
            excluded={excluded}
          />
        </div>
      </PageContainer>
    </PageTransition>
  );
}
