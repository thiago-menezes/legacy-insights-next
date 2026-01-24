import { useState, useMemo, useCallback } from 'react';
import {
  ORGANIZATIONS,
  DEFAULT_ORG_ID,
  DEFAULT_WORKSPACE_ID,
} from './constants';
import type { WorkspaceSelectorState, WorkspaceSelectorActions } from './types';

interface UseWorkspaceSelectorReturn
  extends WorkspaceSelectorState, WorkspaceSelectorActions {}

export const useWorkspaceSelector = (): UseWorkspaceSelectorReturn => {
  const [selectedOrgId, setSelectedOrgId] = useState(DEFAULT_ORG_ID);
  const [selectedWorkspaceId, setSelectedWorkspaceId] =
    useState(DEFAULT_WORKSPACE_ID);
  const [expandedOrgs, setExpandedOrgs] = useState<string[]>([DEFAULT_ORG_ID]);

  const selectedOrg = useMemo(
    () => ORGANIZATIONS.find((o) => o.id === selectedOrgId),
    [selectedOrgId],
  );

  const selectedWorkspace = useMemo(
    () =>
      selectedOrg?.workspaces.find((w) => w.id === selectedWorkspaceId) ||
      selectedOrg?.workspaces[0],
    [selectedOrg, selectedWorkspaceId],
  );

  const toggleOrg = useCallback((orgId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedOrgs((prev) =>
      prev.includes(orgId)
        ? prev.filter((id) => id !== orgId)
        : [...prev, orgId],
    );
  }, []);

  const handleSelectWorkspace = useCallback((orgId: string, wsId: string) => {
    setSelectedOrgId(orgId);
    setSelectedWorkspaceId(wsId);
  }, []);

  return {
    selectedOrgId,
    selectedWorkspaceId,
    expandedOrgs,
    selectedOrg,
    selectedWorkspace,
    toggleOrg,
    handleSelectWorkspace,
  };
};
