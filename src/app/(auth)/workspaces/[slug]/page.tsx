'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { View, Text, Loader, Button, Modal, Card, Grid } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { ProjectForm } from '@/features/projects/form';
import { useProjects } from '@/features/projects/hooks';
import { useSelectedWorkspace } from '@/features/workspaces/context';
import { useWorkspaces } from '@/features/workspaces/hooks';
import { ProjectCreateInput } from '@/libs/api/projects';
import { getMediaUrl } from '@/libs/api/strapi';

const WorkspaceDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const { workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { refreshWorkspaces } = useSelectedWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const workspace = workspaces.find(
    (w) => w.slug === slug || w.documentId === slug,
  );

  const {
    projects,
    isLoading: isLoadingProjects,
    createProject,
  } = useProjects(workspace?.documentId);

  const isLoading = isLoadingWorkspaces || isLoadingProjects;

  const handleCreateProject = async (values: ProjectCreateInput) => {
    if (!workspace) return;

    setIsCreating(true);
    try {
      await createProject({
        ...values,
        workspace: workspace.documentId,
      });
      await refreshWorkspaces();
      setIsModalOpen(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create project:', err);
    } finally {
      setIsCreating(false);
    }
  };

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
        title={workspace.name}
        description="Gerencie os projetos deste workspace"
      />
      <View gap={4}>
        <View direction="row" align="center" justify="space-between">
          <Text variant="featured-2" weight="medium">
            Projetos
          </Text>
          <Button
            variant="solid"
            color="primary"
            icon={<Icon name="plus" />}
            onClick={() => setIsModalOpen(true)}
          >
            Novo Projeto
          </Button>
        </View>

        {projects.length === 0 ? (
          <View
            padding={8}
            align="center"
            justify="center"
            backgroundColor="neutral-faded"
            borderRadius="medium"
          >
            <Text color="neutral">Nenhum projeto cadastrado</Text>
          </View>
        ) : (
          <Grid gap={2} columns={{ s: 1, m: 1, l: 2, xl: 3 }}>
            {projects.map((project) => (
              <Link
                key={project.documentId}
                href={`/integracoes/projetos/${project.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  attributes={{
                    style: {
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    },
                  }}
                  elevated
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
              </Link>
            ))}
          </Grid>
        )}
      </View>
      <Modal active={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <View padding={6} gap={4}>
          <Text variant="featured-3" weight="bold">
            Novo Projeto
          </Text>
          <ProjectForm
            workspaceId={workspace.documentId}
            onSubmit={handleCreateProject}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isCreating}
          />
        </View>
      </Modal>
    </>
  );
};

export default WorkspaceDetailPage;
