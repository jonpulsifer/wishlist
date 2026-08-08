import { UserMenu } from '@/components/shell/user-menu';
import { currentViewer } from '@/lib/auth/viewer';

/** A `Viewer` is already the shape the menu needs, and all of it may cross. */
export async function ShellUser() {
  const viewer = await currentViewer();
  if (!viewer) return null;
  return <UserMenu user={viewer} />;
}
