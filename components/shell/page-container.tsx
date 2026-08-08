import { cn } from '@/lib/utils';

/**
 * The one page column. `pb-28` is the FAB's clearance, not decoration — a card
 * that ends at the viewport edge ends underneath "Add wish".
 */
export function PageContainer({
  children,
  wide,
  className,
}: {
  children: React.ReactNode;
  /** For layouts that want the width more than the line length, such as Plinko. */
  wide?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-4 pb-28 sm:p-6 sm:pb-28',
        wide && 'max-w-5xl',
        className,
      )}
    >
      {children}
    </div>
  );
}
