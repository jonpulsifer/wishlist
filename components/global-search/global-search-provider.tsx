'use client';

import * as React from 'react';
import { GlobalSearchDialog } from './global-search-dialog';

type GlobalSearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const GlobalSearchContext =
  React.createContext<GlobalSearchContextValue | null>(null);

export function useGlobalSearch() {
  const ctx = React.useContext(GlobalSearchContext);
  if (!ctx) {
    throw new Error('useGlobalSearch must be used within GlobalSearchProvider');
  }
  return ctx;
}

export function GlobalSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isK = e.key.toLowerCase() === 'k';
      if (!isK) return;
      if (!(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();
      setOpen((prev) => !prev);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const value = React.useMemo(() => ({ open, setOpen }), [open]);

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
      <GlobalSearchDialog />
    </GlobalSearchContext.Provider>
  );
}
