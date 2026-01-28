import { useMutation } from '@tanstack/react-query';
import {
  integrationsService,
  IntegrationCreateInput,
} from '@/libs/api/services/integrations';
import { useIntegrationsQuery } from './query';

export const useCreateIntegrationMutation = (projectId?: string | number) => {
  const { refetch } = useIntegrationsQuery(projectId);

  return useMutation({
    mutationFn: (data: IntegrationCreateInput) =>
      integrationsService.create(data),
    onSuccess: () => {
      refetch();
    },
  });
};

export const useUpdateIntegrationMutation = (projectId?: string | number) => {
  const { refetch } = useIntegrationsQuery(projectId);

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: Partial<IntegrationCreateInput>;
    }) => integrationsService.update(id, data),
    onSuccess: () => {
      refetch();
    },
  });
};

export const useDeleteIntegrationMutation = (projectId?: string | number) => {
  const { refetch } = useIntegrationsQuery(projectId);

  return useMutation({
    mutationFn: (id: string | number) =>
      integrationsService.deleteIntegration(id),
    onSuccess: () => {
      refetch();
    },
  });
};
