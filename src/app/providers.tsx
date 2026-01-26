'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { PropsWithChildren, useLayoutEffect, useState } from 'react';
import { Reshaped, ToastProvider } from 'reshaped';
import { AuthProvider } from '@/features/auth/context';
import '@/themes/legacy/theme.css';

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [delayToRender, setDelayToRender] = useState(true);

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setDelayToRender(false);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  if (delayToRender) return <></>;

  return (
    <Reshaped theme="legacy" defaultColorMode="light">
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <AuthProvider>{children}</AuthProvider>
          </SessionProvider>
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </ToastProvider>
    </Reshaped>
  );
};

export default Providers;
