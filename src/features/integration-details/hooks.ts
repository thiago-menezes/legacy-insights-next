import { useIntegrationQuery, useUpdateIntegrationMutation } from './api/query';
import { UseIntegrationDetailsResult } from './types';

export const useIntegrationDetails = (
  id: string,
): UseIntegrationDetailsResult => {
  const { data, isLoading, error } = useIntegrationQuery(id);
  const updateMutation = useUpdateIntegrationMutation();

  return {
    data: data?.data || null,
    isLoading,
    error: error ? String(error) : null,
    updateIntegration: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};
