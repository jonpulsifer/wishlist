import { redirect } from 'next/navigation';
import {
  getAllSecretSantaEventsAdmin,
  getAllUsersForExclusions,
  getSecretSantaExclusions,
} from '@/app/actions';
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
import { SecretSantaEventList } from './event-list';
import { ExclusionManager } from './exclusion-manager';

const ADMIN_EMAIL = 'jonathan@pulsifer.ca';

export default async function AdminSecretSantaPage() {
  const { user } = await getSession();

  if (user.email !== ADMIN_EMAIL) {
    redirect('/');
  }

  const [eventsResult, exclusionsResult, usersResult] = await Promise.all([
    getAllSecretSantaEventsAdmin(),
    getSecretSantaExclusions(),
    getAllUsersForExclusions(),
  ]);

  if (eventsResult.error || !eventsResult.events) {
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

  const exclusions = exclusionsResult.exclusions || [];
  const users = usersResult.users || [];

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
