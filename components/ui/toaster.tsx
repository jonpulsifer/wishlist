'use client';

/**
 * The one notification adapter, mounted once in the root layout.
 *
 * There used to be two vocabularies in the tree — this file's shadcn queue and
 * `sonner` — and only one of them was ever mounted, so every toast raised by the
 * roles, wishlists and profile screens went nowhere. Sonner won because it needs
 * no provider, no queue module and no hook of its own.
 *
 * Nothing calls `toast` directly for an action result; that goes through
 * `useAction`.
 */

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as 'light' | 'dark' | 'system'}
      position="bottom-right"
      // Clear of the "Add wish" FAB, which owns the bottom-right corner.
      offset={{ bottom: '6rem' }}
      mobileOffset={{ bottom: '6rem' }}
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
    />
  );
}
