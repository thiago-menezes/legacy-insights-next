import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Workspace } from '@/libs/api/services/workspaces';
import {
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} from './api/mutation';
import { useWorkspacesQuery } from './api/query';
import { WORKSPACE_MESSAGES } from './constants';
import { WorkspaceFormValues } from './types';

export const useWorkspaces = () => {
  const createWorkspace = useCreateWorkspaceMutation();
  const updateWorkspace = useUpdateWorkspaceMutation();
  const deleteWorkspace = useDeleteWorkspaceMutation();
  const getWorkspaces = useWorkspacesQuery();
  const workspaces = getWorkspaces.data;

  const error =
    createWorkspace.error ||
    updateWorkspace.error ||
    deleteWorkspace.error ||
    getWorkspaces.error;

  const handleGetWorkspaces = () => getWorkspaces.refetch();

  const [isModalActive, setIsModalActive] = useState(false);
  const [isModalFirstWorkspaceActive, setIsModalFirstWorkspaceActive] =
    useState(workspaces?.data.length === 0);

  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null,
  );

  const [isSwitchModalActive, setIsSwitchModalActive] = useState(false);
  const [pendingWorkspace, setPendingWorkspace] = useState<Workspace | null>(
    null,
  );

  const router = useRouter();

  const handleOpenCreate = () => {
    setEditingWorkspace(null);
    setIsModalActive(true);
  };

  const handleOpenEdit = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setIsModalActive(true);
  };

  const handleCloseModal = () => {
    setIsModalActive(false);
    setEditingWorkspace(null);
  };

  const handleSubmit = (values: WorkspaceFormValues) => {
    if (editingWorkspace) {
      updateWorkspace.mutate({
        id: editingWorkspace.documentId,
        params: values,
      });
    } else {
      createWorkspace.mutate(values);
    }
    getWorkspaces.refetch();
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm(WORKSPACE_MESSAGES.DELETE_CONFIRM)) {
      deleteWorkspace.mutate(id);
      getWorkspaces.refetch();
    }
  };

  const handleWorkspaceClick = (
    workspace: Workspace,
    currentWorkspaceId?: string,
  ) => {
    if (workspace.documentId !== currentWorkspaceId) {
      setPendingWorkspace(workspace);
      setIsSwitchModalActive(true);
    } else {
      router.push(`/workspaces/${workspace.slug}`);
    }
  };

  const handleConfirmSwitch = (
    selectWorkspace: (orgId: string, projectId: string) => void,
  ) => {
    if (pendingWorkspace) {
      selectWorkspace(
        pendingWorkspace.documentId,
        String(pendingWorkspace.projects?.[0]?.id || ''),
      );
      router.push(`/workspaces/${pendingWorkspace.slug}`);
      setIsSwitchModalActive(false);
      setPendingWorkspace(null);
    }
  };

  const handleCloseSwitchModal = () => {
    setIsSwitchModalActive(false);
    setPendingWorkspace(null);
  };

  return {
    handleGetWorkspaces,
    workspaces: getWorkspaces.data || { data: [] },
    error,
    isLoading:
      getWorkspaces.isLoading ||
      updateWorkspace.isPending ||
      createWorkspace.isPending ||
      deleteWorkspace.isPending,
    isModalActive,
    isModalFirstWorkspaceActive,
    editingWorkspace,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    setIsModalFirstWorkspaceActive,
    isSwitchModalActive,
    pendingWorkspace,
    handleWorkspaceClick,
    handleConfirmSwitch,
    handleCloseSwitchModal,
  };
};
