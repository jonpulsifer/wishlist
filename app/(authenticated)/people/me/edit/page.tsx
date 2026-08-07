import { notFound } from 'next/navigation';
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
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/people">People</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="hidden sm:block">
              <BreadcrumbLink href={`/people/${user.id}`}>
                {user.name || user.email}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col p-4 sm:p-8 max-w-full overflow-hidden">
        <div className="mx-auto w-full max-w-2xl">
          <UserDetailsForm user={user} />
          <ExclusionsForm
            people={people.filter((person) => person.id !== viewer.id)}
            excluded={excluded}
          />
        </div>
      </div>
    </SidebarInset>
  );
}
