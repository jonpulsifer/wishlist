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
  getAllExchanges,
  getAllPeople,
  getSecretSantaExclusions,
} from '@/lib/db/queries-admin';
import { SecretSantaEventList } from './event-list';
import { ExclusionManager } from './exclusion-manager';

export default async function AdminSecretSantaPage() {
  // Same capability the mutations on this screen require, so a role that reaches
  // the page can actually use it. This page used to admit `secret-santa-manager`
  // while every action it called demanded `godmode`.
  const viewer = await requireViewerOrRedirect('manage:secret-santa');

  const [events, exclusions, people] = await Promise.all([
    getAllExchanges(viewer),
    getSecretSantaExclusions(viewer),
    getAllPeople(viewer, 'manage:secret-santa'),
  ]);

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

        <ExclusionManager exclusions={exclusions} users={people} />

        <SecretSantaEventList events={events} />
      </div>
    </SidebarInset>
  );
}
