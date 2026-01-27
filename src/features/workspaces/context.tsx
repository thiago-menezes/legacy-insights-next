'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { StrapiWorkspace } from '@/libs/api/workspaces';
import { useWorkspaces } from './hooks';

// Derive project type from StrapiWorkspace
type StrapiProject = NonNullable<StrapiWorkspace['projects']>[number];

interface SelectedWorkspaceContextValue {
  // IDs
  selectedOrgId: string;
  selectedProjectId: string;
  // Full objects
  selectedOrg: StrapiWorkspace | undefined;
  selectedProject: StrapiProject | undefined;
  // Loading state
  isLoading: boolean;
  // Actions
  selectWorkspace: (orgId: string, projectId: string) => void;
  refreshWorkspaces: () => Promise<void>;
}

const SelectedWorkspaceContext = createContext<
  SelectedWorkspaceContextValue | undefined
>(undefined);

interface SelectedWorkspaceProviderProps {
  children: ReactNode;
}

export const SelectedWorkspaceProvider: React.FC<
  SelectedWorkspaceProviderProps
> = ({ children }) => {
  const { workspaces, isLoading, refresh } = useWorkspaces();
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Initialize from localStorage or first available workspace
  useEffect(() => {
    if (!isLoading && workspaces.length > 0) {
      const savedOrgId = localStorage.getItem('selectedOrgId');
      const savedProjectId = localStorage.getItem('selectedWorkspaceId');

      if (savedOrgId && workspaces.find((w) => w.documentId === savedOrgId)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedOrgId(savedOrgId);
        if (savedProjectId) {
          setSelectedProjectId(savedProjectId);
        }
      } else {
        const firstOrg = workspaces[0];

        setSelectedOrgId(firstOrg.documentId);
        if (firstOrg.projects && firstOrg.projects.length > 0) {
          setSelectedProjectId(String(firstOrg.projects[0].id));
        }
      }
    }
  }, [isLoading, workspaces]);

  const selectedOrg = useMemo(
    () => workspaces.find((o) => o.documentId === selectedOrgId),
    [workspaces, selectedOrgId],
  );

  const selectedProject = useMemo(
    () =>
      selectedOrg?.projects?.find((p) => String(p.id) === selectedProjectId) ||
      selectedOrg?.projects?.[0],
    [selectedOrg, selectedProjectId],
  );

  const selectWorkspace = useCallback((orgId: string, projectId: string) => {
    setSelectedOrgId(orgId);
    setSelectedProjectId(projectId);
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
      selectWorkspace,
      refreshWorkspaces: refresh,
    }),
    [
      selectedOrgId,
      selectedProjectId,
      selectedOrg,
      selectedProject,
      isLoading,
      selectWorkspace,
      refresh,
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
