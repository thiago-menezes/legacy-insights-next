'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSelectedWorkspace } from '@/features/workspaces/context';
import { WorkspaceGuardProps } from './types';

const ALLOWED_PATHS_WITHOUT_WORKSPACE = ['/workspaces'];

export const WorkspaceGuard = ({ children }: WorkspaceGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { hasWorkspaces, isLoading } = useSelectedWorkspace();

  const isAllowedPath = ALLOWED_PATHS_WITHOUT_WORKSPACE.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  useEffect(() => {
    if (!isLoading && !hasWorkspaces && !isAllowedPath) {
      router.replace('/workspaces');
    }
  }, [hasWorkspaces, isLoading, isAllowedPath, router]);

  if (isLoading) {
    return null;
  }

  if (!hasWorkspaces && !isAllowedPath) {
    return null;
  }

  return <>{children}</>;
};
