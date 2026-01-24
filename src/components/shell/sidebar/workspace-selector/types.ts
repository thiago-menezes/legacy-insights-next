import type { IconNames } from '@/components/icon';

export interface Workspace {
  id: string;
  name: string;
}

export interface Organization {
  id: string;
  name: string;
  logoIcon: IconNames;
  workspaces: Workspace[];
}

export interface WorkspaceSelectorState {
  selectedOrgId: string;
  selectedWorkspaceId: string;
  expandedOrgs: string[];
  selectedOrg: Organization | undefined;
  selectedWorkspace: Workspace | undefined;
}

export interface WorkspaceSelectorActions {
  toggleOrg: (orgId: string, e: React.MouseEvent) => void;
  handleSelectWorkspace: (orgId: string, wsId: string) => void;
}
