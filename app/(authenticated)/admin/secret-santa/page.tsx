import { redirect } from 'next/navigation';
import {
  getAllSecretSantaEventsAdmin,
  getAllUsersForExclusions,
  getSecretSantaExclusions,
} from '@/app/actions';
import { getSession } from '@/app/auth';
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
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
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
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4">
          <p className="text-destructive">Error: {eventsResult.error}</p>
        </div>
      </SidebarInset>
    );
  }

  const exclusions = exclusionsResult.exclusions || [];
  const users = usersResult.users || [];

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
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
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-4">
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
