import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/libs/api/axios';
import { InviteFormData, InviteResponse, MemberRole } from '../types';

// Workspace mutations
export const useInviteWorkspaceMember = (workspaceId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteFormData) => {
      if (!workspaceId) throw new Error('Workspace ID is required');
      const response = await apiClient.post<InviteResponse>(
        `/api/workspaces/${workspaceId}/invite`,
        {
          email: data.email,
          role: data.role,
          password: data.password,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', workspaceId],
      });
    },
  });
};

export const useInviteToProjects = (workspaceId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteFormData) => {
      if (!workspaceId) throw new Error('Workspace ID is required');
      if (!data.projects || data.projects.length === 0) {
        throw new Error('At least one project must be selected');
      }

      const response = await apiClient.post(
        `/api/workspaces/${workspaceId}/invite-to-projects`,
        {
          email: data.email,
          role: data.role,
          password: data.password,
          projects: data.projects,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all project members queries since we added to multiple projects
      queryClient.invalidateQueries({
        queryKey: ['project-members'],
      });
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', workspaceId],
      });
    },
  });
};

export const useUpdateWorkspaceMemberRole = (workspaceId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: MemberRole;
    }) => {
      if (!workspaceId) throw new Error('Workspace ID is required');
      await apiClient.put(
        `/api/workspaces/${workspaceId}/members/${memberId}`,
        { role },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', workspaceId],
      });
    },
  });
};

export const useRemoveWorkspaceMember = (workspaceId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      if (!workspaceId) throw new Error('Workspace ID is required');
      await apiClient.delete(
        `/api/workspaces/${workspaceId}/members/${memberId}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['workspace-members', workspaceId],
      });
    },
  });
};

// Project mutations
export const useInviteProjectMember = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteFormData) => {
      if (!projectId) throw new Error('Project ID is required');
      const response = await apiClient.post<InviteResponse>(
        `/api/projects/${projectId}/invite`,
        {
          email: data.email,
          role: data.role,
          password: data.password,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-members', projectId],
      });
    },
  });
};

export const useUpdateProjectMemberRole = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      memberId,
      role,
    }: {
      memberId: string;
      role: MemberRole;
    }) => {
      if (!projectId) throw new Error('Project ID is required');
      await apiClient.put(`/api/projects/${projectId}/members/${memberId}`, {
        role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-members', projectId],
      });
    },
  });
};

export const useRemoveProjectMember = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      if (!projectId) throw new Error('Project ID is required');
      await apiClient.delete(`/api/projects/${projectId}/members/${memberId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['project-members', projectId],
      });
    },
  });
};
