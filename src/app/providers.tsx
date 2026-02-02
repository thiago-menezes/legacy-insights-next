'use client';

import { PropsWithChildren, useLayoutEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { Reshaped, ToastProvider } from 'reshaped';
import { AuthProvider } from '@/features/auth/context';
import { SelectedWorkspaceProvider } from '@/features/workspaces/context';
import { makeQueryClient } from '@/libs/api/queryClient';
import '@/themes/legacy/theme.css';

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => makeQueryClient());
  const [delayToRender, setDelayToRender] = useState(true);

  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      setDelayToRender(false);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  if (delayToRender) return <></>;

  return (
    <Reshaped
      theme="legacy"
      defaultColorMode={
        (localStorage.getItem('theme-mode') as 'light' | 'dark') || 'light'
      }
    >
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <AuthProvider>
              <SelectedWorkspaceProvider>{children}</SelectedWorkspaceProvider>
            </AuthProvider>
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
