import { WorkspaceRole } from '@/libs/api/services/workspaces/types';

export type MemberRole = 'admin' | 'member' | 'viewer';

export interface WorkspaceMemberItem {
  id: number;
  documentId: string | null;
  username?: string;
  email?: string;
  role: WorkspaceRole;
  invitedAt: string | null;
  invitedBy: { id: number; username: string } | null;
  user?: {
    id: number;
    username: string;
    email: string;
  } | null;
}

export interface ProjectMemberItem {
  id: number;
  documentId: string | null;
  username?: string;
  email?: string;
  role: MemberRole;
  invitedAt: string | null;
  invitedBy: { id: number; username: string } | null;
  user?: {
    id: number;
    username: string;
    email: string;
  } | null;
}

export interface InviteFormData {
  email: string;
  role: MemberRole;
  projects?: string[]; // For workspace scope: array of project IDs
}

export interface InviteResponse {
  message: string;
  member: {
    id: number;
    documentId: string;
    user: {
      id: number;
      email: string;
      username: string;
    };
    role: MemberRole;
    invitedAt: string;
  };
  isNewUser?: boolean;
}
