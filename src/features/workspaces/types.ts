import { StrapiWorkspace } from '@/libs/api/workspaces';

export type Workspace = StrapiWorkspace;

export interface WorkspaceFormValues {
  name: string;
  slug: string;
  logo?: File | null;
  owner?: number | string | null;
  members?: (number | string)[];
  integrations?: (number | string)[];
}
