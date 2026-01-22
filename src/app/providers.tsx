'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PropsWithChildren, useState } from 'react';
import { Reshaped, ToastProvider } from 'reshaped';
import '@/styles/theme.scss';

const COLOR_MODE_STORAGE_KEY = 'rs-color-mode';

if (typeof window !== 'undefined') {
  const storedColorMode = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
  if (storedColorMode === 'dark' || storedColorMode === 'light') {
    document.documentElement.setAttribute(
      'data-rs-color-mode',
      storedColorMode,
    );
  }
}

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Reshaped theme="legacy">
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </ToastProvider>
    </Reshaped>
  );
};

export default Providers;
