import { StrapiWorkspace } from '@/libs/api/services/workspaces';

export type Workspace = StrapiWorkspace;

export interface WorkspaceFormValues {
  name: string;
  slug: string;
  logo?: File | string | null;
  owner?: number | string | null;
  members?: (number | string)[];
  integrations?: (number | string)[];
}
