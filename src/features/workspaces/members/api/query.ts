import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/libs/api/axios';
import { WorkspaceMember } from '@/libs/api/services/workspaces/types';

export const useWorkspaceMembers = (workspaceId?: string) => {
  return useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: async () => {
      if (!workspaceId) throw new Error('Workspace ID is required');
      const { data } = await apiClient.get<WorkspaceMember[]>(
        `/api/workspaces/${workspaceId}/members`,
      );
      return data;
    },
    enabled: !!workspaceId,
  });
};
