import { StrapiProject } from '../projects';

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface WorkspaceMember {
  id: number;
  documentId: string | null;
  username: string;
  email: string;
  role: WorkspaceRole;
  invitedAt?: string | null;
  invitedBy?: { id: number; username: string } | null;
}

export interface Workspace {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
  logo: {
    id: number;
    url: string;
    name: string;
    alternativeText?: string;
    caption?: string;
    formats?: Record<string, unknown>;
  } | null;
  owner: {
    id: number;
    username: string;
    email: string;
  } | null;
  workspaceMembers: WorkspaceMember[] | null;
  projects: StrapiProject[] | null;
}

export interface StrapiWorkspaceListResponse {
  data: Workspace[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiWorkspaceResponse {
  data: Workspace;
}

export interface CreateWorkspacePayload {
  name: string;
  slug: string;
  logo?: File | string | null;
  owner?: number | string | null;
  members?: (number | string)[] | null;
}

export interface UpdateWorkspacePayload {
  name: string;
  slug: string;
  logo?: File | string | null;
  owner?: number | string | null;
  members?: (number | string)[] | null;
}
