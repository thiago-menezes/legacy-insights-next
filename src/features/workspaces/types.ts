import { Workspace } from '@/libs/api/services/workspaces';

export interface WorkspaceFormValues {
  name: string;
  slug: string;
  logo?: File | string | null;
  owner?: number | string | null;
  members?: (number | string)[];
  integrations?: (number | string)[];
}

type Project = NonNullable<Workspace['projects']>[number];

export interface SelectedWorkspaceContextValue {
  selectedOrgId: string;
  selectedProjectId: string;
  selectedOrg: Workspace | undefined;
  selectedProject: Project | undefined;
  isLoading: boolean;
  hasWorkspaces: boolean;
  currentWorkspaceHasProjects: boolean;
  selectWorkspace: (orgId: string, projectId: string) => void;
  refreshWorkspaces: () => Promise<unknown>;
}

export interface WorkspaceCardProps {
  workspace: Workspace;
  onEdit: (workspace: Workspace) => void;
  onDelete: (id: string) => void;
  onClick?: (workspace: Workspace) => void;
}
