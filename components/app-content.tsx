import { cn } from '@/lib/utils';

export function AppContent({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 p-2 max-w-full overflow-hidden',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
