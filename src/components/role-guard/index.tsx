'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, useEffect } from 'react';
import { useUserRole } from '@/features/workspaces/use-user-role';

interface RoleGuardProps extends PropsWithChildren {
  requireManagement?: boolean;
  redirectTo?: string;
}

/**
 * Component to guard routes based on user role
 * Redirects viewers away from management pages
 */
export const RoleGuard = ({
  children,
  requireManagement = false,
  redirectTo = '/acesso-negado',
}: RoleGuardProps) => {
  const router = useRouter();
  const { canManage, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading && requireManagement && !canManage) {
      router.replace(redirectTo);
    }
  }, [isLoading, requireManagement, canManage, router, redirectTo]);

  // Show nothing while loading or if access is denied
  if (isLoading || (requireManagement && !canManage)) {
    return null;
  }

  return <>{children}</>;
};
