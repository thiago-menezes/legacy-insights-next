'use client';

import Image from 'next/image';
import { View, Text, Loader, Button, Modal, Card, Grid } from 'reshaped';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { WorkspaceMembersList } from '@/features/workspaces/members/list';
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
                </View>
              </Card>
            ))}
          </Grid>
        )}
      </View>

      <View paddingTop={10}>
        <WorkspaceMembersList
          workspaceId={workspace.documentId}
          workspaceOwnerId={workspace.owner?.id}
        />
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
    </>
  );
};
