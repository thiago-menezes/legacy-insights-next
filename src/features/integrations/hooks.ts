import { useState, useEffect, useCallback } from 'react';
import {
  integrationService,
  StrapiIntegration,
  IntegrationCreateInput,
} from '@/libs/api/services/integrations';

export const useIntegrations = (projectId?: string | number) => {
  const [integrations, setIntegrations] = useState<StrapiIntegration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await integrationService.list(projectId);
      setIntegrations(response.data);
    } catch (err) {
      setError('Falha ao carregar integrações');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const createIntegration = async (data: IntegrationCreateInput) => {
    try {
      await integrationService.create(data);
      await fetchIntegrations();
    } catch (err) {
      setError('Falha ao criar integração');
      throw err;
    }
  };

  const updateIntegration = async (
    id: string | number,
    data: Partial<IntegrationCreateInput>,
  ) => {
    try {
      await integrationService.update(id, data);
      await fetchIntegrations();
    } catch (err) {
      setError('Falha ao atualizar integração');
      throw err;
    }
  };

  const deleteIntegration = async (id: string | number) => {
    try {
      await integrationService.delete(id);
      await fetchIntegrations();
    } catch (err) {
      setError('Falha ao excluir integração');
      throw err;
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  return {
    integrations,
    isLoading,
    error,
    refresh: fetchIntegrations,
    createIntegration,
    updateIntegration,
    deleteIntegration,
  };
};
