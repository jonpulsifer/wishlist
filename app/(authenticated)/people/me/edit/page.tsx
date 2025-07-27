import { notFound, unauthorized } from 'next/navigation';
import { auth } from '@/app/auth';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { getUserById } from '@/lib/db/queries-cached';
import { UserDetailsForm } from './user-details-form';

export default async function EditUserPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }
  const user = await getUserById(session.user.id);
  if (!user) {
    notFound();
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/people">People</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/people/${user.id}`}>
                  {user.name || user.email}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col p-8">
        <div className="mx-auto w-full max-w-2xl">
          <UserDetailsForm user={user} />
        </div>
      </div>
    </SidebarInset>
  );
}
