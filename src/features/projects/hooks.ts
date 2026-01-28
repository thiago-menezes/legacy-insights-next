import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from 'reshaped';
import { ProjectCreateInput } from '@/libs/api/services/projects';
import { useSelectedWorkspace } from '../workspaces/context';
import { useWorkspaces } from '../workspaces/hooks';
import { useCreateProjectMutation } from './api/mutation';
import {
  useProjectBySlugQuery,
  useProjectQuery,
  useProjectsQuery,
} from './api/query';

export const useProjects = () => {
  const params = useParams<{ workspaceSlug: string; projectSlug: string }>();
  const router = useRouter();
  const toast = useToast();
  const slug = params.workspaceSlug;
  const { workspaces, isLoading: isLoadingWorkspaces } = useWorkspaces();
  const { hasWorkspaces, selectedOrg } = useSelectedWorkspace();

  const projectsQuery = useProjectsQuery(selectedOrg?.documentId);
  const projectQuery = useProjectQuery(params.projectSlug);
  const projectBySlugQuery = useProjectBySlugQuery(params.projectSlug);

  const createMutation = useCreateProjectMutation(selectedOrg?.documentId);

  const project = params.projectSlug
    ? projectQuery.data?.data
    : slug
      ? projectBySlugQuery.data
      : null;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const projects = projectsQuery.data?.data || [];

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

  const isLoading = projectsQuery.isLoading;

  return {
    project,
    projects,
    isLoading,
    handleCreateProject: (data: ProjectCreateInput) =>
      createMutation.mutateAsync(data),
    isModalOpen,
    handleOpenCreate,
    handleCloseModal,
    workspace,
  };
};
