import { cn } from '@/lib/utils';

/**
 * A candy cane that fills up. Radix's progress primitive would be a new
 * dependency for two divs; what it buys is the ARIA, spelled out here instead.
 * The stripes are a `repeating-linear-gradient` in `globals.css`, so they sit
 * over whatever colour the fill already has.
 */
export function ProgressBar({
  value,
  label,
  className,
  fillClassName,
}: {
  /** 0–100. */
  value: number;
  label: string;
  className?: string;
  fillClassName?: string;
}) {
  return (
    <div
      className={cn(
        'h-3 w-full overflow-hidden rounded-full bg-muted',
        className,
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn(
          'candy-cane h-full rounded-full bg-primary transition-[width] duration-500',
          fillClassName,
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
