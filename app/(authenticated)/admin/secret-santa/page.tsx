import { redirect } from 'next/navigation';
import {
  getAllSecretSantaEventsAdmin,
  getAllUsersForExclusions,
  getSecretSantaExclusions,
} from '@/app/_actions/secret-santa';
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
import { currentViewer } from '@/lib/auth/viewer';
import { SecretSantaEventList } from './event-list';
import { ExclusionManager } from './exclusion-manager';

export default async function AdminSecretSantaPage() {
  // Same capability the actions below require, so a role that reaches this page
  // can actually use it. This page used to admit `secret-santa-manager` while
  // every action it calls demanded `godmode`.
  const viewer = await currentViewer();
  if (!viewer?.can('manage:secret-santa')) {
    redirect('/');
  }

  const [eventsResult, exclusionsResult, usersResult] = await Promise.all([
    getAllSecretSantaEventsAdmin(),
    getSecretSantaExclusions(),
    getAllUsersForExclusions(),
  ]);

  if (!eventsResult.success) {
    return (
      <SidebarInset>
        <AppHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Secret Santa</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AppHeader>
        <div className="flex flex-1 flex-col gap-6 p-4 max-w-full overflow-hidden">
          <p className="text-destructive">Error: {eventsResult.error}</p>
        </div>
      </SidebarInset>
    );
  }

  const exclusions = exclusionsResult.success
    ? exclusionsResult.exclusions
    : [];
  const users = usersResult.success ? usersResult.users : [];

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Secret Santa</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col gap-6 p-4 max-w-full overflow-hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Secret Santa Management
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            View and manage all Secret Santa events and exclusion pairs.
          </p>
        </div>

        <ExclusionManager exclusions={exclusions} users={users} />

        <SecretSantaEventList events={eventsResult.events} />
      </div>
    </SidebarInset>
  );
}
