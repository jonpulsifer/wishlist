import { notFound, unauthorized } from 'next/navigation';
import { auth } from '@/app/auth';
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
import { getOwnProfile } from '@/lib/db/queries-cached';
import { UserDetailsForm } from './user-details-form';

export default async function EditUserPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }
  const user = await getOwnProfile(session.user.id);
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
        </div>
      </div>
    </SidebarInset>
  );
}
