'use client';

import { View, Text, Button, Loader, Modal } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { WorkspaceCard } from './card';
import { WorkspaceForm } from './form';
import { SwitchWorkspaceModal } from './switch-modal';
import { useWorkspaces } from './hooks';
import { useSelectedWorkspace } from './context';

export const Workspaces = () => {
  const {
    isLoading,
    workspaces,
    isModalActive,
    isModalFirstWorkspaceActive,
    editingWorkspace,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    setIsModalFirstWorkspaceActive,
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
          <Modal active={isModalFirstWorkspaceActive}>
            <View gap={4} align="center" textAlign="center">
              <Text color="primary">
                <Icon name="file-text" size={72} />
                <br />
                Você ainda não possui workspaces
              </Text>

              <Text>
                Comece criando seu primeiro workspace para organizar seus
                projetos.
              </Text>

              <Button
                icon={<Icon name="plus" size={18} />}
                color="primary"
                size="large"
                onClick={() => {
                  handleOpenCreate();
                  setIsModalFirstWorkspaceActive(false);
                }}
              >
                Criar primeiro workspace
              </Button>
            </View>
          </Modal>

          <View align="center">
            <Icon name="file-text" size={48} />
            <Text variant="featured-3" weight="medium">
              Nenhum workspace encontrado
            </Text>
            <Text variant="body-2" color="neutral-faded">
              Comece criando seu primeiro workspace para organizar seus
              projetos.
            </Text>
          </View>
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
        <View gap={4} wrap direction={{ s: 'column', l: 'row' }}>
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
    </>
  );
};
