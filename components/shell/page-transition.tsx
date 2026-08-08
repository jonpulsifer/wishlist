import { ViewTransition } from 'react';

/**
 * Which way a page moves, decided by the link that asked for it.
 *
 * Enter and exit share a class per type: the browser gives the leaving and the
 * arriving snapshot different pseudo-elements, so one name carries both halves.
 * `default: 'none'` keeps browser back/forward and Suspense reveals still —
 * they carry no transition type and a slide there would be a lie about
 * direction.
 *
 * Belongs in a `page.tsx`. Layouts persist, so enter and exit never fire there.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      default="none"
      enter={{
        'section-forward': 'page-forward',
        'section-back': 'page-back',
        'drill-in': 'page-drill-in',
        'drill-out': 'page-drill-out',
        default: 'none',
      }}
      exit={{
        'section-forward': 'page-forward',
        'section-back': 'page-back',
        'drill-in': 'page-drill-in',
        'drill-out': 'page-drill-out',
        default: 'none',
      }}
    >
      {children}
    </ViewTransition>
  );
}
