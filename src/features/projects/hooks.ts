import { useState, useEffect, useCallback } from 'react';
import {
  projectService,
  StrapiProject,
  ProjectCreateInput,
} from '@/libs/api/services/projects';

export const useProjects = (workspaceId?: string) => {
  const [projects, setProjects] = useState<StrapiProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectService.list(workspaceId);
      setProjects(response.data);
    } catch (err) {
      setError('Falha ao carregar projetos');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  const createProject = async (data: ProjectCreateInput) => {
    try {
      await projectService.create(data);
      await fetchProjects();
    } catch (err) {
      setError('Falha ao criar projeto');
      throw err;
    }
  };

  const updateProject = async (
    id: string,
    data: Partial<ProjectCreateInput>,
  ) => {
    try {
      await projectService.update(id, data);
      await fetchProjects();
    } catch (err) {
      setError('Falha ao atualizar projeto');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectService.delete(id);
      await fetchProjects();
    } catch (err) {
      setError('Falha ao excluir projeto');
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refresh: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};

export const useProjectBySlug = (slug: string) => {
  const [project, setProject] = useState<StrapiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectService.getBySlug(slug);
      setProject(response.data);
    } catch (err) {
      setError('Projeto não encontrado');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    isLoading,
    error,
    refresh: fetchProject,
  };
};

export const useProject = (id: string) => {
  const [project, setProject] = useState<StrapiProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectService.get(id);
      setProject(response.data);
    } catch (err) {
      setError('Projeto não encontrado');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    isLoading,
    error,
    refresh: fetchProject,
  };
};
