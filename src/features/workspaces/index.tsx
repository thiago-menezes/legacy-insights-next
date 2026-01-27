'use client';

import { useState } from 'react';
import { View, Text, Button, Loader, Modal } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { StrapiWorkspace } from '@/libs/api/services/workspaces';
import { WorkspaceCard } from './card';
import { useSelectedWorkspace } from './context';
import { WorkspaceForm } from './form';
import { useWorkspaces } from './hooks';
import { WorkspaceFormValues } from './types';

export const Workspaces = () => {
  const {
    workspaces,
    isLoading,
    error,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
  } = useWorkspaces();
  const { refreshWorkspaces } = useSelectedWorkspace();

  const [isModalActive, setIsModalActive] = useState(false);
  const [isModalFirstWorkspaceActive, setIsModalFirstWorkspaceActive] =
    useState(workspaces.length === 0);
  const [editingWorkspace, setEditingWorkspace] =
    useState<StrapiWorkspace | null>(null);

  const handleOpenCreate = () => {
    setEditingWorkspace(null);
    setIsModalActive(true);
  };

  const handleOpenEdit = (workspace: StrapiWorkspace) => {
    setEditingWorkspace(workspace);
    setIsModalActive(true);
  };

  const handleCloseModal = () => {
    setIsModalActive(false);
    setEditingWorkspace(null);
  };

  const handleSubmit = async (values: WorkspaceFormValues) => {
    try {
      if (editingWorkspace) {
        await updateWorkspace(editingWorkspace.documentId, values);
      } else {
        await createWorkspace(values);
      }
      await refreshWorkspaces();
      handleCloseModal();
    } catch {
      // Error is handled in hook
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Tem certeza que deseja excluir este workspace?')) {
      await deleteWorkspace(id);
      await refreshWorkspaces();
    }
  };

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

      {error && (
        <View
          padding={4}
          backgroundColor="critical-faded"
          borderRadius="medium"
        >
          <Text color="critical">{error}</Text>
        </View>
      )}

      {isLoading ? (
        <View align="center" padding={10}>
          <Loader />
        </View>
      ) : workspaces.length === 0 ? (
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
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
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
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </>
  );
};
