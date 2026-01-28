import { useState, useMemo } from 'react';
import { IntegrationType } from '@/libs/api/services/integrations';
import {
  useCreateIntegrationMutation,
  useDeleteIntegrationMutation,
} from './api/mutation';
import { useIntegrationsQuery } from './api/query';
import { PLATFORM_METADATA } from './constants';
import { IntegrationPlatform } from './types';

export const useIntegrations = (projectId?: string) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<IntegrationType>('meta_ads');

  const { data: integrationsData, isLoading } = useIntegrationsQuery(projectId);
  const integrations = integrationsData?.data || [];

  const createMutation = useCreateIntegrationMutation(projectId);
  const deleteMutation = useDeleteIntegrationMutation(projectId);

  const platforms = useMemo<IntegrationPlatform[]>(() => {
    return PLATFORM_METADATA.map((platform) => ({
      ...platform,
      profiles: integrations
        .filter((i) => i.type === platform.id)
        .map((i) => ({
          id: i.documentId,
          name: i.name,
          status: i.status === 'connected' ? 'connected' : 'disconnected',
        })),
    }));
  }, [integrations]);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta integração?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleAdd = (type: string) => {
    setSelectedType(type as IntegrationType);
    setIsModalOpen(true);
  };

  const handleUpdate = (type: string) => {
    setSelectedType(type as IntegrationType);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values: unknown) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await createMutation.mutateAsync(values as any);
      setIsModalOpen(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return {
    platforms,
    isLoading,
    isModalOpen,
    selectedType,
    handleDelete,
    handleAdd,
    handleUpdate,
    handleFormSubmit,
    handleModalClose,
  };
};
