import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs/api/axios';
import { ProjectMemberItem } from '../types';

export const useProjectMembers = (projectId?: string) => {
  return useQuery({
    queryKey: ['project-members', projectId],
    queryFn: async () => {
      if (!projectId) throw new Error('Project ID is required');
      const { data } = await apiClient.get<ProjectMemberItem[]>(
        `/api/projects/${projectId}/members`,
      );
      return data;
    },
    enabled: !!projectId,
  });
};

export const useSearchUser = (email: string) => {
  return useQuery({
    queryKey: ['users', 'search', email],
    queryFn: async () => {
      const { data } = await apiClient.get<
        { id: number; email: string; username: string }[]
      >(`/api/users?filters[email][$eq]=${email}`);
      return data;
    },
    enabled: !!email && email.length > 5,
    retry: false,
  });
};

export const useWorkspaceProjects = (workspaceId?: string) => {
  return useQuery({
    queryKey: ['workspace-projects', workspaceId],
    queryFn: async () => {
      if (!workspaceId) throw new Error('Workspace ID is required');
      const { data } = await apiClient.get<
        { id: number; documentId: string; name: string; slug: string }[]
      >(`/api/workspaces/${workspaceId}/projects`);
      return data;
    },
    enabled: !!workspaceId,
  });
};
