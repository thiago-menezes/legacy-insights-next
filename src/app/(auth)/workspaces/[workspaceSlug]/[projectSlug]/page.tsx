'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { View, Text, Loader } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { Integrations } from '@/features/integrations';
import { useProject } from '@/features/projects/hooks';
import { useSelectedWorkspace } from '@/features/workspaces/context';
import { WorkspaceMembersList } from '@/features/workspaces/members/list';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.projectSlug as string;
  const { project, isLoading: isLoadingProject } = useProject({ slug });
  const {
    selectedOrg,
    currentWorkspaceHasProjects,
    isLoading: isLoadingWorkspace,
  } = useSelectedWorkspace();

  const isLoading = isLoadingProject || isLoadingWorkspace;

  useEffect(() => {
    if (!isLoadingWorkspace && !currentWorkspaceHasProjects && selectedOrg) {
      router.push(`/workspaces/${selectedOrg.slug}`);
    }
  }, [isLoadingWorkspace, currentWorkspaceHasProjects, selectedOrg]);

  if (isLoading) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Loader />
      </View>
    );
  }

  if (!project) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Text>Projeto não encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <PageTitle
        icon={<Icon name="folder" size={32} />}
        title={`Projeto: ${project.name}`}
        description={
          project.description || 'Gerencie as integrações deste projeto'
        }
        breadcrumbs={[
          {
            label: 'Lista de Workspaces',
            href: '/workspaces',
          },
          {
            label: `Workspace: ${selectedOrg?.name}`,
            href: `/workspaces/${selectedOrg?.slug}`,
          },
          {
            label: `Projeto: ${project.name}`,
          },
        ]}
      />

      <Integrations projectId={project.documentId} />

      {selectedOrg && (
        <View paddingTop={10}>
          <WorkspaceMembersList
            workspaceId={selectedOrg.documentId}
            workspaceOwnerId={selectedOrg.owner?.id}
          />
        </View>
      )}
    </>
  );
};

export default Page;
