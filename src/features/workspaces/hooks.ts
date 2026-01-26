import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/context';
import {
  workspaceService,
  StrapiWorkspace,
  WorkspaceCreateInput,
} from '@/libs/api/workspaces';

export const useWorkspaces = () => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<StrapiWorkspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await workspaceService.list();
      setWorkspaces(response.data);
    } catch (err) {
      setError('Falha ao carregar workspaces');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createWorkspace = async (data: WorkspaceCreateInput) => {
    try {
      const payload = { ...data };
      if (user?.id && !payload.owner) {
        payload.owner = user.id;
      }
      await workspaceService.create(payload);
      await fetchWorkspaces();
    } catch (err) {
      setError('Falha ao criar workspace');
      throw err;
    }
  };

  const updateWorkspace = async (
    id: string | number,
    data: Partial<WorkspaceCreateInput>,
  ) => {
    try {
      await workspaceService.update(id, data);
      await fetchWorkspaces();
    } catch (err) {
      setError('Falha ao atualizar workspace');
      throw err;
    }
  };

  const deleteWorkspace = async (id: string | number) => {
    try {
      await workspaceService.delete(id);
      await fetchWorkspaces();
    } catch (err) {
      setError('Falha ao excluir workspace');
      throw err;
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return {
    workspaces,
    isLoading,
    error,
    refresh: fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  };
};
