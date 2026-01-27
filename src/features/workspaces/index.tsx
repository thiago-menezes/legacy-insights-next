'use client';

import { useState } from 'react';
import { View, Text, Button, Grid, Loader, Modal } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { StrapiWorkspace } from '@/libs/api/workspaces';
import { WorkspaceCard } from './card';
import { useSelectedWorkspace } from './context';
import { WorkspaceForm } from './form';
import { useWorkspaces } from './hooks';
import styles from './styles.module.scss';
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
    <View gap={6} className={styles.workspaces}>
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
        <div className={styles.emptyState}>
          <View gap={4} align="center">
            <Icon name="file-text" size={48} />
            <View align="center">
              <Text variant="featured-3" weight="medium">
                Nenhum workspace encontrado
              </Text>
              <Text variant="body-2" color="neutral-faded">
                Comece criando seu primeiro workspace para organizar seus
                projetos.
              </Text>
            </View>
            <Button color="primary" onClick={handleOpenCreate}>
              Criar Primeiro Workspace
            </Button>
          </View>
        </div>
      ) : (
        <Grid columns={{ s: 1, m: 1, l: 2, xl: 3 }} gap={4}>
          {workspaces.map((workspace) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </Grid>
      )}

      <Modal active={isModalActive} onClose={handleCloseModal}>
        <View padding={6} gap={6}>
          <Text variant="featured-3" weight="bold">
            {editingWorkspace ? 'Editar Workspace' : 'Novo Workspace'}
          </Text>

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
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
          />
        </View>
      </Modal>
    </View>
  );
};
