import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'reshaped';
import { StrapiIntegration } from '@/libs/api/services/integrations';
import { useProjectRealTime } from '@/libs/real-time/use-integration-real-time';
import {
  useCreateIntegrationMutation,
  useDeleteIntegrationMutation,
  useProcessIntegrationMutation,
  useUpdateIntegrationMutation,
} from '../api/mutation';
import { useIntegrationsQuery } from '../api/query';
import { PLATFORM_METADATA } from '../constants';

export const useIntegrationsData = (projectId?: string) => {
  const { data: integrationsData, isLoading } = useIntegrationsQuery(projectId);
  const queryClient = useQueryClient();
  const { show } = useToast();

  const integrations = useMemo(
    () => integrationsData?.data || [],
    [integrationsData?.data],
  );

  useProjectRealTime(projectId || null, (data) => {
    const integration = integrations.find(
      (i) => i.documentId === data.integrationId,
    );
    const integrationName = integration?.name || 'Integração';

    if (data.processStatus === 'finalizado com sucesso') {
      show({
        title: 'Sucesso',
        text: `${integrationName} processada com sucesso!`,
        color: 'positive',
      });
    } else if (data.processStatus === 'erro') {
      show({
        title: 'Erro no Processamento',
        text: `Falha ao processar ${integrationName}: ${data.errorMessage || 'Erro desconhecido'}`,
        color: 'critical',
      });
    }

    // Update query cache manually for instant feedback
    queryClient.setQueryData(
      ['integrations', 'list', projectId],
      (oldData: { data: StrapiIntegration[] } | undefined) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((i: StrapiIntegration) =>
            i.documentId === data.integrationId
              ? {
                  ...i,
                  processStatus: data.processStatus,
                  errorMessage: data.errorMessage || i.errorMessage,
                }
              : i,
          ),
        };
      },
    );

    // Also trigger refetch to be safe and get all fresh data
    queryClient.invalidateQueries({
      queryKey: ['integrations', 'list', projectId],
    });
  });

  const createMutation = useCreateIntegrationMutation(projectId);
  const updateMutation = useUpdateIntegrationMutation(projectId);
  const deleteMutation = useDeleteIntegrationMutation(projectId);
  const processMutation = useProcessIntegrationMutation(projectId);

  const platforms = useMemo(() => {
    return PLATFORM_METADATA.map((platform) => ({
      ...platform,
      profiles: integrations
        .filter((i) => i.type === platform.id)
        .map((i) => ({
          id: i.documentId,
          name: i.name,
          status: i.status || 'disconnected',
          processStatus: i.processStatus,
          integration: i,
        })),
    }));
  }, [integrations]);

  return {
    integrations,
    platforms,
    isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
    processMutation,
    show,
  };
};
