'use client';

import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { useMemo } from 'react';
import { View, Button, Loader, Badge, Select, Tabs } from 'reshaped';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { Table } from '@/components/table';
import { EditRoleModal } from './edit-role-modal';
import { useUsersManagement } from './hooks';
import { InviteModal } from './invite-modal';
import { RemoveModal } from './remove-modal';
import styles from './styles.module.scss';
import { WorkspaceMemberItem } from './types';

export const UsersManagement = () => {
  const {
    activeScope,
    selectedProjectId,
    workspaceOwnerId,
    selectedWorkspace,
    currentMembers,
    projects,
    isLoading,
    isLoadingProjects,
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
    handleScopeChange,
    handleProjectChange,
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
          const isOwner =
            workspaceOwnerId &&
            params.data?.id === workspaceOwnerId &&
            activeScope === 'workspace';
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
              <Badge color={isAdmin || isOwner ? 'primary' : 'neutral'}>
                {isOwner ? 'Owner' : roleLabel}
              </Badge>
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
          const isOwner =
            workspaceOwnerId &&
            params.data?.id === workspaceOwnerId &&
            activeScope === 'workspace';

          if (isOwner || params.data?.role === 'owner') return null;
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
    [
      workspaceOwnerId,
      activeScope,
      handleOpenEditRoleModal,
      handleOpenRemoveModal,
    ],
  );

  const projectOptions = useMemo(() => {
    return projects.map((project) => ({
      value: project.documentId,
      label: project.name,
    }));
  }, [projects]);

  if (!selectedWorkspace) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <EmptyState
          icon="user"
          title="Selecione um workspace"
          description="Selecione um workspace para gerenciar os usuários"
        />
      </View>
    );
  }

  return (
    <>
      <PageTitle
        icon={<Icon name="users" size={32} />}
        title="Gerenciamento de Usuários"
        description="Gerencie os membros do workspace e projetos"
      >
        <Button
          color="primary"
          icon={<Icon name="plus" size={18} />}
          onClick={handleOpenInviteModal}
          disabled={activeScope === 'project' && !selectedProjectId}
        >
          Convidar
        </Button>
      </PageTitle>

      <View className={styles.container}>
        <View
          direction="row"
          align="center"
          justify="space-between"
          width="100%"
          gap={4}
        >
          <Tabs
            value={activeScope}
            onChange={({ value }) =>
              handleScopeChange(value as 'workspace' | 'project')
            }
          >
            <Tabs.List>
              <Tabs.Item value="workspace">Workspace</Tabs.Item>
              <Tabs.Item value="project">Projeto</Tabs.Item>
            </Tabs.List>
          </Tabs>

          {activeScope === 'project' && (
            <View className={styles.projectSelector}>
              {isLoadingProjects ? (
                <Loader size="small" />
              ) : (
                <Select
                  name="project"
                  value={selectedProjectId || ''}
                  onChange={({ value }) => handleProjectChange(value)}
                  options={projectOptions}
                  placeholder="Selecione um projeto"
                />
              )}
            </View>
          )}
        </View>

        {isLoading ? (
          <View align="center" padding={4}>
            <Loader />
          </View>
        ) : activeScope === 'project' && !selectedProjectId ? (
          <View className={styles.emptyState}>
            <EmptyState
              icon="folder"
              title="Selecione um projeto"
              description="Escolha um projeto para visualizar seus membros"
            />
          </View>
        ) : currentMembers.length === 0 ? (
          <View className={styles.emptyState}>
            <EmptyState
              icon="user"
              title="Nenhum membro encontrado"
              description={
                activeScope === 'workspace'
                  ? 'Este workspace ainda não possui membros além do owner'
                  : 'Este projeto ainda não possui membros'
              }
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
        scope={activeScope}
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
        scope={activeScope}
      />
    </>
  );
};
