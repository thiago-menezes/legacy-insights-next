import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useMemo, useState } from 'react';
import { View, Text, Button, Loader, Badge } from 'reshaped';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { Table } from '@/components/table';
import { useWorkspaceMembers } from './api/query';
import { InviteMemberModal } from './invite-modal';

interface WorkspaceMember {
  id: number;
  username: string;
  email: string;
  role?: string;
}

interface WorkspaceMembersListProps {
  workspaceId: string;
  workspaceOwnerId?: number;
}

export const WorkspaceMembersList = ({
  workspaceId,
  workspaceOwnerId,
}: WorkspaceMembersListProps) => {
  const { data: members, isLoading } = useWorkspaceMembers(workspaceId);
  const [isInviteModalActive, setIsInviteModalActive] = useState(false);

  const columnDefs = useMemo<ColDef<WorkspaceMember>[]>(
    () => [
      {
        field: 'username',
        headerName: 'Nome',
        flex: 1,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
      },
      {
        field: 'role',
        headerName: 'Permissões',
        width: 150,
        cellRenderer: (params: ICellRendererParams<WorkspaceMember>) => {
          const isOwner =
            workspaceOwnerId && params.data?.id === workspaceOwnerId;
          const isAdmin = params.data?.role === 'admin' || isOwner;

          return (
            <View align="start" justify="center" height="100%">
              <Badge color={isAdmin ? 'primary' : 'neutral'}>
                {isOwner ? 'Owner' : params.data?.role || 'Member'}
              </Badge>
            </View>
          );
        },
      },
      {
        headerName: 'Ações',
        width: 100,
        cellRenderer: (params: ICellRendererParams<WorkspaceMember>) => {
          const isOwner =
            workspaceOwnerId && params.data?.id === workspaceOwnerId;

          if (isOwner) return null;

          return (
            <View align="center" justify="center" height="100%">
              <Button
                icon={<Icon name="trash" size={16} />}
                variant="ghost"
                color="critical"
                onClick={() => {
                  /* TODO: Implement remove member */
                }}
              />
            </View>
          );
        },
      },
    ],
    [workspaceOwnerId],
  );

  if (isLoading) {
    return (
      <View align="center" padding={4}>
        <Loader />
      </View>
    );
  }

  return (
    <View gap={4}>
      <View direction="row" align="center" justify="space-between" width="100%">
        <Text variant="featured-3">Membros do Workspace</Text>
        <Button
          color="primary"
          icon={<Icon name="plus" size={18} />}
          onClick={() => setIsInviteModalActive(true)}
        >
          Convidar Membro
        </Button>
      </View>

      {members && members.length > 0 ? (
        <View height="400px">
          <Table<WorkspaceMember>
            rowData={members}
            columnDefs={columnDefs}
            suppressCellFocus
            pagination={false}
          />
        </View>
      ) : (
        <EmptyState icon="user" title="Nenhum membro encontrado" />
      )}

      <InviteMemberModal
        active={isInviteModalActive}
        onClose={() => setIsInviteModalActive(false)}
        workspaceId={workspaceId}
      />
    </View>
  );
};
