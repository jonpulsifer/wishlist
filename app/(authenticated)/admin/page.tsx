import { CandyCane, Shield, Users } from 'lucide-react';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SidebarInset } from '@/components/ui/sidebar';
import { requireViewerOrRedirect } from '@/lib/auth/viewer';

export default async function AdminPage() {
  // `if (!user.roles)` never fired — `roles` is always an array, so every
  // signed-in viewer reached this page.
  await requireViewerOrRedirect('view:admin');

  return (
    <SidebarInset>
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Admin</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>
      <div className="flex flex-1 flex-col gap-6 p-4 max-w-full overflow-hidden">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Administrative tools for managing the wishlist application.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CandyCane className="h-5 w-5" />
                Secret Santa
              </CardTitle>
              <CardDescription>
                Manage Secret Santa events and participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/secret-santa">Manage Events</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Management
              </CardTitle>
              <CardDescription>
                Manage user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/roles">Manage Roles</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  );
}
