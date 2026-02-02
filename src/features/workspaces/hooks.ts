import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context';
import { Workspace } from '@/libs/api/services/workspaces';
import {
  useCreateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useUpdateWorkspaceMutation,
} from './api/mutation';
import { useWorkspacesQuery } from './api/query';
import { WorkspaceFormValues } from './types';

export const useWorkspaces = () => {
  const { user } = useAuth();
  const createWorkspace = useCreateWorkspaceMutation();
  const updateWorkspace = useUpdateWorkspaceMutation();
  const deleteWorkspace = useDeleteWorkspaceMutation();
  const getWorkspaces = useWorkspacesQuery();

  const error =
    createWorkspace.error ||
    updateWorkspace.error ||
    deleteWorkspace.error ||
    getWorkspaces.error;

  const handleGetWorkspaces = () => getWorkspaces.refetch();

  const [isModalActive, setIsModalActive] = useState(false);

  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null,
  );

  const [isSwitchModalActive, setIsSwitchModalActive] = useState(false);
  const [pendingWorkspace, setPendingWorkspace] = useState<Workspace | null>(
    null,
  );

  const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(
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
      if (user?.id) {
        createWorkspace.mutate({
          ...values,
          owner: user.id,
        });
      }
    }
    getWorkspaces.refetch();
    handleCloseModal();
  };

  const handleDelete = (workspace: Workspace) => {
    setWorkspaceToDelete(workspace);
    setIsDeleteModalActive(true);
  };

  const handleConfirmDelete = () => {
    if (workspaceToDelete) {
      deleteWorkspace.mutate(workspaceToDelete.documentId, {
        onSuccess: () => {
          getWorkspaces.refetch();
          setIsDeleteModalActive(false);
          setWorkspaceToDelete(null);
        },
      });
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalActive(false);
    setWorkspaceToDelete(null);
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
    editingWorkspace,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    isDeleteModalActive,
    workspaceToDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    isSwitchModalActive,
    pendingWorkspace,
    handleWorkspaceClick,
    handleConfirmSwitch,
    handleCloseSwitchModal,
  };
};
