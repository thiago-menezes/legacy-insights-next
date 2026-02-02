import { useCallback, useMemo, useState } from 'react';
import { useSelectedWorkspace } from '@/features/workspaces/context';
import { DEFAULT_ORG_ICON } from './constants';
import type { WorkspaceSelectorActions, WorkspaceSelectorState } from './types';

interface UseWorkspaceSelectorReturn
  extends WorkspaceSelectorState, WorkspaceSelectorActions {}

export const useWorkspaceSelector = (): UseWorkspaceSelectorReturn => {
  const {
    selectedOrgId,
    selectedProjectId: selectedWorkspaceId,
    selectedOrg: selectedOrgData,
    selectedProject: selectedWorkspaceData,
    selectWorkspace,
  } = useSelectedWorkspace();

  // UI-specific local state (not shared across pages)
  const [expandedOrgs, setExpandedOrgs] = useState<string[]>([]);

  const toggleOrg = useCallback((orgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedOrgs((prev) =>
      prev.includes(orgId)
        ? prev.filter((id) => id !== orgId)
        : [...prev, orgId],
    );
  }, []);

  const handleSelectWorkspace = useCallback(
    (orgId: string, wsId: string) => {
      selectWorkspace(orgId, wsId);
    },
    [selectWorkspace],
  );

  // Transform selectedOrg to the expected format for the selector UI
  const selectedOrg = useMemo(() => {
    if (!selectedOrgData) return undefined;
    return {
      id: selectedOrgData.documentId,
      name: selectedOrgData.name,
      logoIcon: DEFAULT_ORG_ICON,
      logo: selectedOrgData.logo,
      workspaces: (selectedOrgData.projects || []).map((i) => ({
        id: String(i.id),
        name: i.name,
      })),
    };
  }, [selectedOrgData]);

  // Transform selectedWorkspace to the expected format
  const selectedWorkspace = useMemo(() => {
    if (!selectedWorkspaceData) return undefined;
    return {
      id: String(selectedWorkspaceData.id),
      name: selectedWorkspaceData.name,
    };
  }, [selectedWorkspaceData]);

  return {
    selectedOrgId: selectedOrgId || '',
    selectedWorkspaceId: selectedWorkspaceId || '',
    expandedOrgs,
    selectedOrg,
    selectedWorkspace,
    toggleOrg,
    handleSelectWorkspace,
  };
};
