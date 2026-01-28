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
