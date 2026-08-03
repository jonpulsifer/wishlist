import Image from 'next/image';
import { cn } from '@/lib/utils';
import santa from '@/public/santa.png';

/**
 * Santa, clinging to the edge of something.
 *
 * The artwork is cropped so he leans in from his left, so `side="left"` is the
 * natural fit and `side="right"` mirrors him. Horizontal placement is baked in
 * either way — callers set the vertical offset (`top-*`) and leave the rest.
 * He sits half outside his container, which is what makes it a peek.
 *
 * `santa.png` is 102×145, so 48px is the hard upper bound before a 2× display
 * upscales him into mush. The default is 36px, which leaves the standard 1rem
 * overhang showing a useful fraction of him rather than a red sliver.
 *
 * The artwork's right side is a flat crop. `.santa-peek` in `globals.css`
 * fades that edge to transparent, so he no longer has to be hidden behind
 * anything or kept shorter than it — he can simply hang off a left edge.
 * `-z-10` stays because tucking him behind a card still reads better.
 *
 * The offset lives on the wrapper and the slide on the image because a CSS
 * animation sets `transform` wholesale — one element cannot carry both, and
 * the animation wins silently.
 *
 * Purely decorative: `aria-hidden`, never a tap target. The wiggle is a CSS
 * keyframe rather than `motion`, which keeps this a server component and lets
 * the one `prefers-reduced-motion` block in `globals.css` cover it.
 *
 * Give the parent `relative isolate` and no `overflow-hidden`. The `isolate` is
 * load-bearing: without a stacking context the negative z-index escapes the
 * parent entirely and he disappears behind the page background.
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
        // -z-10 puts him behind his in-flow siblings, which is what hides the
        // artwork's straight cut edge. Without it he reads as sliced off.
        'pointer-events-none absolute -z-10 block w-9 select-none',
        // 1rem of overhang, matched to the page gutter so he never pushes the
        // document sideways on a narrow screen.
        side === 'left'
          ? 'left-0 -translate-x-4'
          : 'right-0 translate-x-4 -scale-x-100',
        className,
      )}
    >
      <Image
        src={santa}
        alt=""
        // Already tiny; re-encoding it only costs sharpness.
        unoptimized
        className="santa-peek h-auto w-full drop-shadow-md"
      />
    </span>
  );
}
