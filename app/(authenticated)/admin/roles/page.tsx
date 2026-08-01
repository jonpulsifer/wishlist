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
  ensureBuiltInRoles,
  getAllRoles,
  getAllUsersForRoles,
} from '@/lib/db/queries-admin';
import { RoleManager } from './role-manager';

export default async function AdminRolesPage() {
  const viewer = await requireViewerOrRedirect('manage:roles');

  // The built-in roles are created here rather than inside the read, which is
  // where this upsert used to hide.
  await ensureBuiltInRoles(viewer);

  const [roles, users] = await Promise.all([
    getAllRoles(viewer),
    getAllUsersForRoles(viewer),
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
              <BreadcrumbPage>Roles</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col gap-6 p-4 max-w-full overflow-hidden">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Role Management</h1>
        </div>
        <p className="text-muted-foreground">
          Manage user roles and permissions for the application.
        </p>

        <RoleManager roles={roles} users={users} />
      </div>
    </SidebarInset>
  );
}
