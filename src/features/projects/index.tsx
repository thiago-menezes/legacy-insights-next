'use client';

import Image from 'next/image';
import { Button, Card, Grid, Loader, Modal, Text, View } from 'reshaped';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { getMediaUrl } from '@/libs/api/strapi';
import { useSelectedWorkspace } from '../workspaces/context';
import { ProjectForm } from './form';
import { useProjects } from './hooks';
import { SwitchProjectModal } from './switch-modal';

export const WorkspaceDetail = () => {
  const {
    projects,
    isModalOpen,
    handleOpenCreate,
    handleCloseModal,
    workspace,
    handleCreateProject,
    isLoading,
    isSwitchModalActive,
    pendingProject,
    handleProjectClick,
    handleConfirmSwitch,
    handleCloseSwitchModal,
    selectedProject,
    isDeleteModalOpen,
    projectToDelete,
    handleOpenDelete,
    handleCloseDelete,
    handleConfirmDelete,
    isDeleting,
  } = useProjects();

  const { selectWorkspace } = useSelectedWorkspace();

  if (isLoading) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Loader />
      </View>
    );
  }

  if (!workspace) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Text>Workspace não encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <PageTitle
        icon={
          workspace.logo?.url && (
            <Image
              src={getMediaUrl(workspace.logo.url) || ''}
              alt={workspace.logo.alternativeText || workspace.name}
              width={24}
              height={24}
              style={{
                objectFit: 'cover',
                borderRadius: 'inherit',
              }}
              unoptimized
            />
          )
        }
        breadcrumbs={[
          {
            label: 'Lista de Workspaces',
            href: '/workspaces',
          },
          {
            label: `Workspace: ${workspace.name}`,
          },
        ]}
        title={`Workspace: ${workspace.name}`}
        description="Gerencie seu workspace"
      >
        <Button
          variant="solid"
          color="primary"
          icon={<Icon name="plus" />}
          onClick={handleOpenCreate}
        >
          Novo Projeto
        </Button>
      </PageTitle>

      <View gap={4} paddingTop={4}>
        <Text variant="featured-3">Projetos</Text>

        {projects.length === 0 ? (
          <EmptyState
            icon="file-text"
            title="Nenhum projeto cadastrado"
            description="Comece criando seu primeiro projeto."
            actionLabel="Novo Projeto"
            onAction={handleOpenCreate}
          />
        ) : (
          <Grid gap={2} columns={{ s: 1, m: 1, l: 2, xl: 3 }}>
            {projects.map((project) => (
              <Card
                key={project.documentId}
                onClick={() => handleProjectClick(project)}
                attributes={{
                  style: {
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    border:
                      project.documentId === selectedProject?.documentId
                        ? '1px solid var(--rs-color-primary-default)'
                        : '1px solid var(--rs-color-background-neutral-faded)',
                    backgroundColor:
                      project.documentId === selectedProject?.documentId
                        ? 'var(--rs-color-background-primary-faded)'
                        : 'transparent',
                  },
                }}
              >
                <View direction="row" align="center" gap={4}>
                  <Icon name="folder" size={24} />
                  <View grow>
                    <Text variant="body-1" weight="medium">
                      {project.name}
                    </Text>
                    <Text variant="caption-1" color="neutral">
                      /{project.slug}
                    </Text>
                  </View>
                  {project.integrations?.length === 0 && (
                    <Button
                      icon={<Icon name="trash" size={16} />}
                      variant="ghost"
                      color="critical"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDelete(project);
                      }}
                    />
                  )}
                </View>
              </Card>
            ))}
          </Grid>
        )}
      </View>

      <Modal active={isModalOpen} onClose={handleCloseModal}>
        {isModalOpen && (
          <>
            <Modal.Title>Novo Projeto</Modal.Title>

            <ProjectForm
              workspaceId={workspace.documentId}
              onSubmit={handleCreateProject}
              onCancel={handleCloseModal}
              isLoading={isLoading}
            />
          </>
        )}
      </Modal>

      <SwitchProjectModal
        active={isSwitchModalActive}
        onClose={handleCloseSwitchModal}
        onConfirm={() => handleConfirmSwitch(selectWorkspace)}
        currentProject={selectedProject}
        pendingProject={pendingProject}
      />

      <Modal active={isDeleteModalOpen} onClose={handleCloseDelete} size="s">
        <Modal.Title>Remover Projeto</Modal.Title>
        <View gap={4}>
          <Text>
            Tem certeza que deseja remover o projeto{' '}
            <Text as="span" weight="bold">
              {projectToDelete?.name}
            </Text>
            ? Esta ação não pode ser desfeita.
          </Text>
          <View direction="row" justify="end" gap={2}>
            <Button onClick={handleCloseDelete} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button
              color="critical"
              onClick={handleConfirmDelete}
              loading={isDeleting}
            >
              Remover
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
};
