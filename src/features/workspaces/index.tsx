'use client';

import { View, Button, Loader, Modal } from 'reshaped';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { WorkspaceCard } from './card';
import { useSelectedWorkspace } from './context';
import { DeleteWorkspaceModal } from './delete-modal';
import { WorkspaceForm } from './form';
import { useWorkspaces } from './hooks';
import { SwitchWorkspaceModal } from './switch-modal';

export const Workspaces = () => {
  const {
    isLoading,
    workspaces,
    isModalActive,
    editingWorkspace,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    isDeleteModalActive,
    workspaceToDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    isSwitchModalActive,
    pendingWorkspace,
    handleWorkspaceClick,
    handleConfirmSwitch,
    handleCloseSwitchModal,
  } = useWorkspaces();

  const { selectedOrg, selectedOrgId, selectWorkspace } =
    useSelectedWorkspace();

  return (
    <>
      <PageTitle
        title="Workspaces"
        description="Gerencie seus espaços de trabalho e organize seus projetos"
      >
        <Button
          color="primary"
          icon={<Icon name="plus" size={18} />}
          onClick={handleOpenCreate}
        >
          Criar Workspace
        </Button>
      </PageTitle>

      {isLoading ? (
        <View align="center" padding={10}>
          <Loader />
        </View>
      ) : workspaces?.data.length === 0 ? (
        <View
          gap={4}
          align="center"
          height="100%"
          justify="center"
          padding={8}
          textAlign="center"
        >
          <EmptyState
            icon="file-text"
            title="Nenhum workspace encontrado"
            description="Comece criando seu primeiro workspace para organizar seus projetos."
          />

          <Button
            icon={<Icon name="plus" size={18} />}
            color="primary"
            size="large"
            onClick={handleOpenCreate}
          >
            Criar Primeiro Workspace
          </Button>
        </View>
      ) : (
        <View gap={4} paddingTop={4} wrap direction={{ s: 'column', l: 'row' }}>
          {workspaces?.data.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onClick={(w) => handleWorkspaceClick(w, selectedOrgId)}
            />
          ))}
        </View>
      )}

      <Modal active={isModalActive} onClose={handleCloseModal}>
        <Modal.Title>
          {editingWorkspace ? 'Editar Workspace' : 'Novo Workspace'}
        </Modal.Title>

        <WorkspaceForm
          key={editingWorkspace?.documentId || 'new'}
          initialValues={
            editingWorkspace
              ? {
                  name: editingWorkspace.name,
                  slug: editingWorkspace.slug,
                  logo: editingWorkspace.logo?.url || null,
                }
              : undefined
          }
          isModalActive={isModalActive}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      <SwitchWorkspaceModal
        active={isSwitchModalActive}
        onClose={handleCloseSwitchModal}
        onConfirm={() => handleConfirmSwitch(selectWorkspace)}
        currentWorkspace={selectedOrg}
        pendingWorkspace={pendingWorkspace}
      />
      <DeleteWorkspaceModal
        active={isDeleteModalActive}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        workspace={workspaceToDelete}
        isPending={isLoading}
      />
    </>
  );
};
