import { Workspace } from '@/libs/api/services/workspaces';

export interface WorkspaceCardProps {
  workspace: Workspace;
  onEdit: (workspace: Workspace) => void;
  onDelete: (workspace: Workspace) => void | Promise<void>;
  onClick?: (workspace: Workspace) => void;
}
