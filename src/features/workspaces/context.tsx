'use client';

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  PropsWithChildren,
} from 'react';
import { useWorkspaces } from './hooks';
import { SelectedWorkspaceContextValue } from './types';

const SelectedWorkspaceContext = createContext<
  SelectedWorkspaceContextValue | undefined
>(undefined);

export const SelectedWorkspaceProvider = ({ children }: PropsWithChildren) => {
  const { workspaces, isLoading, handleGetWorkspaces } = useWorkspaces();
  const [userSelectedOrgId, setUserSelectedOrgId] = useState<string | null>(
    null,
  );
  const [userSelectedProjectId, setUserSelectedProjectId] = useState<
    string | null
  >(null);

  const selectedOrgId = useMemo(() => {
    if (userSelectedOrgId) return userSelectedOrgId;

    if (!isLoading && workspaces?.data.length > 0) {
      const savedOrgId =
        typeof window !== 'undefined'
          ? localStorage.getItem('selectedOrgId')
          : null;
      if (
        savedOrgId &&
        workspaces.data.some((w) => w.documentId === savedOrgId)
      ) {
        return savedOrgId;
      }
      return workspaces.data[0].documentId;
    }

    return '';
  }, [userSelectedOrgId, workspaces, isLoading]);

  const selectedOrg = useMemo(() => {
    const org = workspaces?.data.find((o) => o.documentId === selectedOrgId);
    return org;
  }, [workspaces, selectedOrgId]);

  const selectedProjectId = useMemo(() => {
    if (userSelectedProjectId) return userSelectedProjectId;

    if (!isLoading && selectedOrg) {
      const savedProjectId =
        typeof window !== 'undefined'
          ? localStorage.getItem('selectedWorkspaceId')
          : null;
      if (
        savedProjectId &&
        selectedOrg.projects?.some((p) => String(p.id) === savedProjectId)
      ) {
        return savedProjectId;
      }
      return selectedOrg.projects?.[0]
        ? String(selectedOrg.projects[0].id)
        : '';
    }

    return '';
  }, [userSelectedProjectId, selectedOrg, isLoading]);

  const selectedProject = useMemo(
    () =>
      selectedOrg?.projects?.find((p) => String(p.id) === selectedProjectId) ||
      selectedOrg?.projects?.[0],
    [selectedOrg, selectedProjectId],
  );

  const hasWorkspaces = useMemo(
    () => (workspaces?.data?.length || 0) > 0,
    [workspaces],
  );

  const currentWorkspaceHasProjects = useMemo(
    () => (selectedOrg?.projects?.length || 0) > 0,
    [selectedOrg],
  );

  const selectWorkspace = useCallback((orgId: string, projectId: string) => {
    setUserSelectedOrgId(orgId);
    setUserSelectedProjectId(projectId);
    localStorage.setItem('selectedOrgId', orgId);
    localStorage.setItem('selectedWorkspaceId', projectId);
  }, []);

  const value = useMemo<SelectedWorkspaceContextValue>(
    () => ({
      selectedOrgId,
      selectedProjectId,
      selectedOrg,
      selectedProject,
      isLoading,
      hasWorkspaces,
      currentWorkspaceHasProjects,
      selectWorkspace,
      refreshWorkspaces: handleGetWorkspaces,
    }),
    [
      selectedOrgId,
      selectedProjectId,
      selectedOrg,
      selectedProject,
      isLoading,
      hasWorkspaces,
      currentWorkspaceHasProjects,
      selectWorkspace,
      handleGetWorkspaces,
    ],
  );

  return (
    <SelectedWorkspaceContext.Provider value={value}>
      {children}
    </SelectedWorkspaceContext.Provider>
  );
};

export const useSelectedWorkspace = (): SelectedWorkspaceContextValue => {
  const context = useContext(SelectedWorkspaceContext);
  if (!context) {
    throw new Error(
      'useSelectedWorkspace must be used within a SelectedWorkspaceProvider',
    );
  }
  return context;
};
