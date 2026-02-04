import { useMemo } from 'react';
import { useAuth } from '@/features/auth/context';
import { WorkspaceRole } from '@/libs/api/services/workspaces';
import { useSelectedWorkspace } from './context';

interface UseUserRoleResult {
  role: WorkspaceRole | null;
  isOwner: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;
  canManage: boolean;
  canCreateProject: boolean;
  canCreateIntegration: boolean;
  canInviteMembers: boolean;
  canDeleteWorkspace: boolean;
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

    // 1. Check if user is the owner
    if (selectedOrg.owner?.id === user.id) {
      return 'owner';
    }

    // 2. Find user in workspace members list
    const workspaceMember = selectedOrg.workspaceMembers?.find(
      (m) => String(m.user?.id) === String(user.id),
    );
    if (workspaceMember) {
      return workspaceMember.role;
    }

    // 3. Fallback: Find user in project members list
    // Check all projects in the workspace and take the highest role
    const roles: WorkspaceRole[] = [];

    selectedOrg.projects?.forEach((project) => {
      const projectMember = project.projectMembers?.find(
        (pm) => String(pm.user?.id) === String(user.id),
      );
      if (projectMember) {
        roles.push(projectMember.role as WorkspaceRole);
      }
    });

    if (roles.length > 0) {
      const hierarchy: WorkspaceRole[] = ['admin', 'editor', 'viewer'];
      for (const r of hierarchy) {
        if (roles.includes(r)) {
          return r;
        }
      }
    }
    return null;
  }, [user, selectedOrg]);

  const isOwner = role === 'owner';
  const isAdmin = role === 'admin';
  // Treat 'member' as 'editor' for backward compatibility
  const isEditor = role === 'editor' || (role as string) === 'member';
  const isViewer = role === 'viewer';

  // Allow management access if:
  // - Still loading (prevent premature blocking)
  // - No workspace selected yet (allow access to create/select workspace)
  // - User is owner, admin, or editor
  // Block only if: we have a workspace AND user is explicitly a viewer
  const canManage = isLoading || !selectedOrg || isOwner || isAdmin || isEditor;

  const canCreateProject = isOwner || isAdmin || isEditor;
  const canCreateIntegration = isOwner || isAdmin || isEditor;
  const canInviteMembers = isOwner || isAdmin || isEditor;
  const canDeleteWorkspace = isOwner || isAdmin;

  return {
    role,
    isOwner,
    isAdmin,
    isEditor,
    isViewer,
    canManage,
    canCreateProject,
    canCreateIntegration,
    canInviteMembers,
    canDeleteWorkspace,
    isLoading,
  };
}
