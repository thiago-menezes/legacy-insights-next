'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Loader,
  Button,
  Modal,
  Card,
  Grid,
  useToast,
} from 'reshaped';
import { EmptyState } from '@/components/empty-state';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { ProjectForm } from '@/features/projects/form';
import { useProjects } from '@/features/projects/hooks';
import { useSelectedWorkspace } from '@/features/workspaces/context';
import { useWorkspaces } from '@/features/workspaces/hooks';
import { WorkspaceMembersList } from '@/features/workspaces/members/list';
import { ProjectCreateInput } from '@/libs/api/services/projects';
import { getMediaUrl } from '@/libs/api/strapi';

const WorkspaceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const slug = params.workspaceSlug as string;
  const { workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { refreshWorkspaces, hasWorkspaces } = useSelectedWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!isLoadingWorkspaces && !hasWorkspaces) {
      toast.show({
        title: 'Acesso restrito',
        text: 'Você não consegue visualizar projetos pois não tem nenhum workspace cadastrado.',
        color: 'critical',
      });
      router.push('/workspaces');
    }
  }, [isLoadingWorkspaces, hasWorkspaces, router, toast]);

  const workspace = workspaces?.data.find(
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
        breadcrumbs={[
          {
            label: 'Lista de Workspaces',
            href: '/workspaces',
          },
          {
            label: `Workspace: ${workspace.name}`,
          },
        ]}
        title="Projetos"
        description={
          <>
            Gerencie os projetos do workspace <strong>{workspace.name}</strong>
          </>
        }
      >
        <Button
          variant="solid"
          color="primary"
          icon={<Icon name="plus" />}
          onClick={() => setIsModalOpen(true)}
        >
          Novo Projeto
        </Button>
      </PageTitle>

      <View gap={4}>
        {projects.length === 0 ? (
          <EmptyState
            icon="file-text"
            title="Nenhum projeto cadastrado"
            description="Comece criando seu primeiro projeto."
          />
        ) : (
          <Grid gap={2} columns={{ s: 1, m: 1, l: 2, xl: 3 }}>
            {projects.map((project) => (
              <Link
                key={project.documentId}
                href={`/workspaces/${workspace.slug}/${project.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  attributes={{
                    style: {
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      border:
                        '1px solid var(--rs-color-background-neutral-faded)',
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
              </Link>
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

      <Modal active={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Title>Novo Projeto</Modal.Title>

        <ProjectForm
          workspaceId={workspace.documentId}
          onSubmit={handleCreateProject}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isCreating}
        />
      </Modal>
    </>
  );
};

export default WorkspaceDetailPage;
