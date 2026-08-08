import { Plus } from 'lucide-react';
import { AddGiftDialog } from '@/components/add-gift-dialog';
import { currentViewer } from '@/lib/auth/viewer';
import { getPeopleForNewWishModal } from '@/lib/db/queries-cached';

export async function ShellFab() {
  const viewer = await currentViewer();
  if (!viewer) return null;

  const people = await getPeopleForNewWishModal(viewer.id);

  return (
    <AddGiftDialog
      users={people}
      currentUserId={viewer.id}
      trigger={
        <button
          type="button"
          // `max()` rather than a sum: on a device with a home indicator the
          // inset already is the clearance.
          style={{
            bottom: 'max(1.25rem, env(safe-area-inset-bottom))',
            right: 'max(1rem, env(safe-area-inset-right))',
          }}
          className="fab-enter fixed z-30 flex min-h-14 items-center gap-2 rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground shadow-lg outline-none transition-transform hover:brightness-110 active:scale-95 focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Plus className="size-5" />
          Add wish
        </button>
      }
    />
  );
}
