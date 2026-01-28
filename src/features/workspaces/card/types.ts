import { Workspace } from '@/libs/api/services/workspaces';

export interface WorkspaceCardProps {
  workspace: Workspace;
  onEdit: (workspace: Workspace) => void;
  onDelete: (id: string) => void | Promise<void>;
  onClick?: (workspace: Workspace) => void;
}
