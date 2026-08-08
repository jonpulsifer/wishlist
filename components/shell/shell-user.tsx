import { UserMenu } from '@/components/shell/user-menu';
import { currentViewer } from '@/lib/auth/viewer';

/** Named fields only: a `Viewer` never crosses to the browser whole. */
export async function ShellUser() {
  const viewer = await currentViewer();
  if (!viewer) return null;
  return (
    <UserMenu
      user={{ name: viewer.name, email: viewer.email, image: viewer.image }}
    />
  );
}
