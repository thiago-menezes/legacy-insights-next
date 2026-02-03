import { useMemo } from 'react';
import { useAuth } from '@/features/auth/context';
import { WorkspaceRole } from '@/libs/api/services/workspaces';
import { useSelectedWorkspace } from './context';

interface UseUserRoleResult {
  role: WorkspaceRole | null;
  isOwner: boolean;
  isAdmin: boolean;
  isViewer: boolean;
  canManage: boolean;
  isLoading: boolean;
}

/**
 * Hook to get the current user's role in the selected workspace
 * @returns User role information and permission helpers
 */
export function useUserRole(): UseUserRoleResult {
  const { user } = useAuth();
  const { selectedOrg, isLoading } = useSelectedWorkspace();

  const role = useMemo<WorkspaceRole | null>(() => {
    if (!user || !selectedOrg) {
      return null;
    }

    // Check if user is the owner
    if (selectedOrg.owner?.id === user.id) {
      return 'owner';
    }

    // Find user in workspace members list
    const member = selectedOrg.workspaceMembers?.find(
      (m) => m.user?.id === user.id,
    );
    return member?.role || null;
  }, [user, selectedOrg]);

  const isOwner = role === 'owner';
  const isAdmin = role === 'admin';
  const isViewer = role === 'viewer';

  // Allow management access if:
  // - Still loading (prevent premature blocking)
  // - No workspace selected yet (allow access to create/select workspace)
  // - User is owner, admin, or member
  // Block only if: we have a workspace AND user is explicitly a viewer
  const canManage =
    isLoading ||
    !selectedOrg ||
    role === 'owner' ||
    role === 'admin' ||
    role === 'member';

  return {
    role,
    isOwner,
    isAdmin,
    isViewer,
    canManage,
    isLoading,
  };
}
