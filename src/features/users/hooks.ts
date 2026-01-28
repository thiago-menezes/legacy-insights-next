import { useState, useCallback, useMemo } from 'react';
import { useProjectsQuery } from '@/features/projects/api/query';
import { useSelectedWorkspace } from '@/features/workspaces/context';
import { useWorkspaceMembers } from '@/features/workspaces/members/api/query';
import {
  useInviteWorkspaceMember,
  useUpdateWorkspaceMemberRole,
  useRemoveWorkspaceMember,
  useInviteProjectMember,
  useUpdateProjectMemberRole,
  useRemoveProjectMember,
} from './api/mutation';
import { useProjectMembers } from './api/query';
import { InviteFormData, MemberRole, WorkspaceMemberItem } from './types';

type MemberScope = 'workspace' | 'project';

export const useUsersManagement = () => {
  const { selectedOrg, selectedProject } = useSelectedWorkspace();

  const workspaceId = selectedOrg?.documentId;
  const workspaceOwnerId = selectedOrg?.owner?.id;

  // Scope state
  const [activeScope, setActiveScope] = useState<MemberScope>('workspace');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    selectedProject?.documentId || null,
  );

  // Modal states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<WorkspaceMemberItem | null>(null);

  // Data fetching
  const { data: workspaceMembers, isLoading: isLoadingWorkspaceMembers } =
    useWorkspaceMembers(workspaceId);

  const { data: projectMembers, isLoading: isLoadingProjectMembers } =
    useProjectMembers(selectedProjectId || undefined);

  const { data: projectsResponse, isLoading: isLoadingProjects } =
    useProjectsQuery(workspaceId);

  // Mutations - Workspace
  const inviteWorkspaceMemberMutation = useInviteWorkspaceMember(workspaceId);
  const updateWorkspaceMemberRoleMutation =
    useUpdateWorkspaceMemberRole(workspaceId);
  const removeWorkspaceMemberMutation = useRemoveWorkspaceMember(workspaceId);

  // Mutations - Project
  const inviteProjectMemberMutation = useInviteProjectMember(
    selectedProjectId || undefined,
  );
  const updateProjectMemberRoleMutation = useUpdateProjectMemberRole(
    selectedProjectId || undefined,
  );
  const removeProjectMemberMutation = useRemoveProjectMember(
    selectedProjectId || undefined,
  );

  // Extract projects from response
  const projects = useMemo(() => {
    if (!projectsResponse) return [];
    if ('data' in projectsResponse) {
      return projectsResponse.data;
    }
    return [];
  }, [projectsResponse]);

  // Computed values
  const currentMembers = useMemo((): WorkspaceMemberItem[] => {
    if (activeScope === 'workspace') {
      return (workspaceMembers || []).map((member) => ({
        ...member,
        invitedAt: member.invitedAt ?? null,
        invitedBy: member.invitedBy ?? null,
      }));
    }
    return (projectMembers || []).map((member) => ({
      ...member,
      invitedAt: member.invitedAt ?? null,
      invitedBy: member.invitedBy ?? null,
    }));
  }, [activeScope, workspaceMembers, projectMembers]);

  const isLoading = useMemo(() => {
    if (activeScope === 'workspace') {
      return isLoadingWorkspaceMembers;
    }
    return isLoadingProjectMembers;
  }, [activeScope, isLoadingWorkspaceMembers, isLoadingProjectMembers]);

  const isMutating = useMemo(() => {
    return (
      inviteWorkspaceMemberMutation.isPending ||
      inviteProjectMemberMutation.isPending ||
      updateWorkspaceMemberRoleMutation.isPending ||
      updateProjectMemberRoleMutation.isPending ||
      removeWorkspaceMemberMutation.isPending ||
      removeProjectMemberMutation.isPending
    );
  }, [
    inviteWorkspaceMemberMutation.isPending,
    inviteProjectMemberMutation.isPending,
    updateWorkspaceMemberRoleMutation.isPending,
    updateProjectMemberRoleMutation.isPending,
    removeWorkspaceMemberMutation.isPending,
    removeProjectMemberMutation.isPending,
  ]);

  // Handlers
  const handleOpenInviteModal = useCallback(() => {
    setIsInviteModalOpen(true);
  }, []);

  const handleCloseInviteModal = useCallback(() => {
    setIsInviteModalOpen(false);
  }, []);

  const handleOpenEditRoleModal = useCallback((member: WorkspaceMemberItem) => {
    setSelectedMember(member);
    setIsEditRoleModalOpen(true);
  }, []);

  const handleCloseEditRoleModal = useCallback(() => {
    setSelectedMember(null);
    setIsEditRoleModalOpen(false);
  }, []);

  const handleOpenRemoveModal = useCallback((member: WorkspaceMemberItem) => {
    setSelectedMember(member);
    setIsRemoveModalOpen(true);
  }, []);

  const handleCloseRemoveModal = useCallback(() => {
    setSelectedMember(null);
    setIsRemoveModalOpen(false);
  }, []);

  const handleInvite = useCallback(
    async (data: InviteFormData) => {
      if (activeScope === 'workspace') {
        await inviteWorkspaceMemberMutation.mutateAsync(data);
      } else if (selectedProjectId) {
        await inviteProjectMemberMutation.mutateAsync(data);
      }
      handleCloseInviteModal();
    },
    [
      activeScope,
      selectedProjectId,
      inviteWorkspaceMemberMutation,
      inviteProjectMemberMutation,
      handleCloseInviteModal,
    ],
  );

  const handleUpdateRole = useCallback(
    async (role: MemberRole) => {
      if (!selectedMember?.documentId) return;

      if (activeScope === 'workspace') {
        await updateWorkspaceMemberRoleMutation.mutateAsync({
          memberId: selectedMember.documentId,
          role,
        });
      } else if (selectedProjectId) {
        await updateProjectMemberRoleMutation.mutateAsync({
          memberId: selectedMember.documentId,
          role,
        });
      }
      handleCloseEditRoleModal();
    },
    [
      activeScope,
      selectedMember,
      selectedProjectId,
      updateWorkspaceMemberRoleMutation,
      updateProjectMemberRoleMutation,
      handleCloseEditRoleModal,
    ],
  );

  const handleRemoveMember = useCallback(async () => {
    if (!selectedMember?.documentId) return;

    if (activeScope === 'workspace') {
      await removeWorkspaceMemberMutation.mutateAsync(
        selectedMember.documentId,
      );
    } else if (selectedProjectId) {
      await removeProjectMemberMutation.mutateAsync(selectedMember.documentId);
    }
    handleCloseRemoveModal();
  }, [
    activeScope,
    selectedMember,
    selectedProjectId,
    removeWorkspaceMemberMutation,
    removeProjectMemberMutation,
    handleCloseRemoveModal,
  ]);

  const handleScopeChange = useCallback((scope: MemberScope) => {
    setActiveScope(scope);
  }, []);

  const handleProjectChange = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);

  return {
    // State
    activeScope,
    selectedProjectId,
    workspaceId,
    workspaceOwnerId,
    selectedWorkspace: selectedOrg,

    // Data
    currentMembers,
    projects,
    isLoading,
    isLoadingProjects,
    isMutating,

    // Modal states
    isInviteModalOpen,
    isEditRoleModalOpen,
    isRemoveModalOpen,
    selectedMember,

    // Handlers
    handleOpenInviteModal,
    handleCloseInviteModal,
    handleOpenEditRoleModal,
    handleCloseEditRoleModal,
    handleOpenRemoveModal,
    handleCloseRemoveModal,
    handleInvite,
    handleUpdateRole,
    handleRemoveMember,
    handleScopeChange,
    handleProjectChange,
  };
};
