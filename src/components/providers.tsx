'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            retry: (failureCount, error) => {
              const msg = (error as Error)?.message || '';
              if (/4\d\d/.test(msg) && !/429/.test(msg)) return false;
              return failureCount < 4;
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: false,
            refetchOnReconnect: 'always',
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* AetherCast está diseñado primero para modo oscuro. El tema claro tiene
          deuda visual conocida (Phase 7 backlog). La clase `.dark` se aplica
          permanentemente desde el `<html>` (layout.tsx) — no necesitamos
          ThemeProvider porque cualquier librería que la mute genera regresiones
          en mobile. */}
      {children}
    </QueryClientProvider>
  );
}
