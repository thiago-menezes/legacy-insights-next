import { useMutation } from '@tanstack/react-query';
import {
  CreateWorkspacePayload,
  workspacesService,
} from '@/libs/api/services/workspaces';
import { useWorkspacesQuery } from './query';
import { UpdateWorkspaceParams } from './types';

export const useCreateWorkspaceMutation = () => {
  const { refetch: refetchWorkspaces } = useWorkspacesQuery();

  return useMutation({
    mutationFn: (params: CreateWorkspacePayload) =>
      workspacesService.create(params),
    onSuccess: () => {
      refetchWorkspaces();
    },
  });
};

export const useUpdateWorkspaceMutation = () => {
  const { refetch: refetchWorkspaces } = useWorkspacesQuery();

  return useMutation({
    mutationFn: ({ id, params }: UpdateWorkspaceParams) =>
      workspacesService.update(id, params),
    onSuccess: () => {
      refetchWorkspaces();
    },
  });
};

export const useDeleteWorkspaceMutation = () => {
  const { refetch: refetchWorkspaces } = useWorkspacesQuery();

  return useMutation({
    mutationFn: (id: string) => workspacesService.deleteWorkspace(id),
    onSuccess: () => {
      refetchWorkspaces();
    },
  });
};
