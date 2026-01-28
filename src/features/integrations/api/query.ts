import { useQuery } from '@tanstack/react-query';
import { integrationsService } from '@/libs/api/services/integrations';

export const useIntegrationsQuery = (projectId?: string | number) => {
  return useQuery({
    queryKey: ['integrations', 'list', projectId],
    queryFn: () => integrationsService.list(projectId),
    enabled: !!projectId,
  });
};

export const useIntegrationQuery = (id: string | number) => {
  return useQuery({
    queryKey: ['integrations', 'detail', id],
    queryFn: () => integrationsService.get(id),
    enabled: !!id,
  });
};
