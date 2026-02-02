'use client';

import { useMemo } from 'react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Badge, Button, Loader, Text, View } from 'reshaped';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { Table } from '@/components/table';
import { EditRoleModal } from './edit-role-modal';
import { useUsersManagement } from './hooks';
import { InviteModal } from './invite-modal';
import { RemoveModal } from './remove-modal';
import styles from './styles.module.scss';
import { WorkspaceMemberItem } from './types';

export const ProjectMembers = () => {
  const {
    selectedProjectId,
    workspaceId,
    selectedWorkspace,
    currentMembers,
    isLoading,
    isMutating,
    isInviteModalOpen,
    isEditRoleModalOpen,
    isRemoveModalOpen,
    selectedMember,
    handleOpenInviteModal,
    handleCloseInviteModal,
    handleOpenEditRoleModal,
    handleCloseEditRoleModal,
    handleOpenRemoveModal,
    handleCloseRemoveModal,
    handleInvite,
    handleUpdateRole,
    handleRemoveMember,
  } = useUsersManagement();

  const columnDefs = useMemo<ColDef<WorkspaceMemberItem>[]>(
    () => [
      {
        field: 'username',
        headerName: 'Nome',
        flex: 1,
        minWidth: 150,
      },
      {
        field: 'email',
        headerName: 'Email',
        flex: 1,
        minWidth: 200,
      },
      {
        field: 'role',
        headerName: 'Função',
        width: 150,
        cellRenderer: (params: ICellRendererParams<WorkspaceMemberItem>) => {
          const isAdmin =
            params.data?.role === 'admin' || params.data?.role === 'owner';

          const roleLabel =
            params.data?.role === 'owner'
              ? 'Owner'
              : params.data?.role === 'admin'
                ? 'Admin'
                : params.data?.role === 'viewer'
                  ? 'Visualizador'
                  : 'Membro';

          return (
            <View className={styles.roleCell}>
              <Badge color={isAdmin ? 'primary' : 'neutral'}>{roleLabel}</Badge>
            </View>
          );
        },
      },
      {
        field: 'invitedAt',
        headerName: 'Convidado em',
        width: 150,
        valueFormatter: (params) => {
          if (!params.value) return '-';
          return new Date(params.value).toLocaleDateString('pt-BR');
        },
      },
      {
        headerName: 'Ações',
        width: 120,
        cellRenderer: (params: ICellRendererParams<WorkspaceMemberItem>) => {
          if (params.data?.role === 'owner') return null;
          if (!params.data?.documentId) return null;

          return (
            <View className={styles.actionsCell}>
              <Button
                icon={<Icon name="edit" size={16} />}
                variant="ghost"
                onClick={() => handleOpenEditRoleModal(params.data!)}
              />
              <Button
                icon={<Icon name="trash" size={16} />}
                variant="ghost"
                color="critical"
                onClick={() => handleOpenRemoveModal(params.data!)}
              />
            </View>
          );
        },
      },
    ],
    [handleOpenEditRoleModal, handleOpenRemoveModal],
  );

  if (!selectedWorkspace || !selectedProjectId) {
    return null;
  }

  return (
    <View paddingTop={4}>
      <View gap={4} direction="row" justify="space-between" align="center">
        <View paddingBottom={4}>
          <Text variant="featured-2" weight="medium">
            Membros do projeto
          </Text>
          <Text variant="body-2">
            Gerencie as pessoas que possuem acesso a este projeto
          </Text>
        </View>

        <Button
          color="primary"
          icon={<Icon name="plus" size={18} />}
          onClick={handleOpenInviteModal}
        >
          Convidar
        </Button>
      </View>

      <View className={styles.container}>
        {isLoading ? (
          <View align="center" padding={4}>
            <Loader />
          </View>
        ) : currentMembers.length === 0 ? (
          <View className={styles.emptyState}>
            <EmptyState
              icon="user"
              title="Nenhum membro encontrado"
              description="Este projeto ainda não possui membros"
              actionLabel="Convidar Membro"
              onAction={handleOpenInviteModal}
            />
          </View>
        ) : (
          <View className={styles.tableContainer}>
            <Table<WorkspaceMemberItem>
              rowData={currentMembers}
              columnDefs={columnDefs}
              suppressCellFocus
              pagination={false}
            />
          </View>
        )}
      </View>

      <InviteModal
        active={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        onSubmit={handleInvite}
        isPending={isMutating}
        scope="project"
        workspaceId={workspaceId}
        currentMembers={currentMembers}
      />

      <EditRoleModal
        active={isEditRoleModalOpen}
        onClose={handleCloseEditRoleModal}
        onSubmit={handleUpdateRole}
        member={selectedMember}
        isPending={isMutating}
      />

      <RemoveModal
        active={isRemoveModalOpen}
        onClose={handleCloseRemoveModal}
        onConfirm={handleRemoveMember}
        member={selectedMember}
        isPending={isMutating}
        scope="project"
      />
    </View>
  );
};
