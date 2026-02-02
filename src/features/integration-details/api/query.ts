import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { integrationsService } from '@/libs/api/services/integrations';
import { IntegrationCreateInput } from '@/libs/api/services/integrations/types';

export const useIntegrationQuery = (id: string) => {
  return useQuery({
    queryKey: ['integrations', id],
    queryFn: () => integrationsService.get(id),
    enabled: !!id,
  });
};

interface UpdateIntegrationPayload extends Partial<IntegrationCreateInput> {
  id: string | number;
}

export const useUpdateIntegrationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateIntegrationPayload) =>
      integrationsService.update(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['integrations', variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });
};
