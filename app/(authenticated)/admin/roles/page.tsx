import { redirect } from 'next/navigation';
import { getAllRoles, getAllUsersForRoles } from '@/app/_actions/roles';
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
import { RoleManager } from './role-manager';

export default async function AdminRolesPage() {
  const viewer = await currentViewer();
  if (!viewer?.can('manage:roles')) {
    redirect('/');
  }

  const [rolesResult, usersResult] = await Promise.all([
    getAllRoles(),
    getAllUsersForRoles(),
  ]);

  if (!rolesResult.success) {
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
          <p className="text-destructive">Error: {rolesResult.error}</p>
        </div>
      </SidebarInset>
    );
  }

  const roles = rolesResult.roles;
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
