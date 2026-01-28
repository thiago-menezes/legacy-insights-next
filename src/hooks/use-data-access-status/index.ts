'use client';

import { useMemo } from 'react';
import { useIntegrationsQuery } from '@/features/integrations/api/query';
import { useSelectedWorkspace } from '@/features/workspaces/context';
import {
  DataAccessStatus,
  DataAccessState,
  UseDataAccessStatusOptions,
} from './types';

export const useDataAccessStatus = (
  options: UseDataAccessStatusOptions = {},
): DataAccessStatus => {
  const { integrationType = 'meta_ads', hasData = false } = options;

  const {
    selectedOrg,
    selectedProject,
    isLoading: isLoadingWorkspaces,
    hasWorkspaces,
    currentWorkspaceHasProjects,
  } = useSelectedWorkspace();

  const projectDocumentId = selectedProject?.documentId;

  const { data: integrationsData, isLoading: isLoadingIntegrations } =
    useIntegrationsQuery(projectDocumentId);

  const integrationsOfThisType = useMemo(() => {
    const integrations = integrationsData?.data || [];
    return integrations.filter(
      (integration) => integration.type === integrationType,
    );
  }, [integrationsData, integrationType]);

  const hasIntegration = integrationsOfThisType.length > 0;

  const isLoading = isLoadingWorkspaces || isLoadingIntegrations;

  const state = useMemo<DataAccessState>(() => {
    if (isLoading) return 'loading';
    if (!hasWorkspaces) return 'no-workspace';
    if (!currentWorkspaceHasProjects) return 'no-project';
    if (!hasIntegration) return 'no-integration';
    if (!hasData) return 'no-data';
    return 'ready';
  }, [
    isLoading,
    hasWorkspaces,
    currentWorkspaceHasProjects,
    hasIntegration,
    hasData,
  ]);

  const orgSlug = selectedOrg?.slug;
  const projectSlug = selectedProject?.slug;

  const integrationsPageUrl =
    orgSlug && projectSlug
      ? `/workspaces/${orgSlug}/${projectSlug}`
      : '/workspaces';

  const projectsPageUrl = orgSlug ? `/workspaces/${orgSlug}` : '/workspaces';

  return {
    state,
    isLoading,
    hasWorkspaces,
    hasProjects: currentWorkspaceHasProjects,
    hasIntegration,
    hasData,
    integrationsPageUrl,
    projectsPageUrl,
  };
};

export type {
  DataAccessStatus,
  DataAccessState,
  UseDataAccessStatusOptions,
} from './types';
