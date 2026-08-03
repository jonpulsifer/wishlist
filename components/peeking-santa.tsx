import Image from 'next/image';
import { cn } from '@/lib/utils';
import santa from '@/public/santa.png';

/**
 * Santa, hanging off the left edge of something. Callers set the vertical
 * offset; the rest is fixed.
 *
 * `santa.png` is 102x145 and cropped flat on the right, so two constraints
 * come with him: 48px is the widest he goes before a 2x display upscales him
 * into mush, and `.santa-peek` has to fade that crop out. The offset lives on
 * the wrapper and the slide on the image because a CSS animation sets
 * `transform` wholesale and would silently win.
 */
export function PeekingSanta({
  side = 'left',
  className,
}: {
  side?: 'left' | 'right';
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute -z-10 block w-9 select-none',
        side === 'left'
          ? 'left-0 -translate-x-4'
          : 'right-0 translate-x-4 -scale-x-100',
        className,
      )}
    >
      <Image
        src={santa}
        alt=""
        unoptimized
        className="santa-peek h-auto w-full drop-shadow-md"
      />
    </span>
  );
}
