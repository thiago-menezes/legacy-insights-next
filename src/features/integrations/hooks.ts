import { useState, useMemo } from 'react';
import {
  IntegrationCreateInput,
  IntegrationType,
  StrapiIntegration,
} from '@/libs/api/services/integrations';
import {
  useCreateIntegrationMutation,
  useDeleteIntegrationMutation,
  useUpdateIntegrationMutation,
  useValidateIntegrationMutation,
  useProcessIntegrationMutation,
} from './api/mutation';
import { useIntegrationsQuery } from './api/query';
import { PLATFORM_METADATA } from './constants';

export const useIntegrations = (projectId?: string) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<IntegrationType>('meta_ads');
  const [editingIntegration, setEditingIntegration] = useState<
    StrapiIntegration | undefined
  >(undefined);

  const { data: integrationsData, isLoading } = useIntegrationsQuery(projectId);
  const integrations = integrationsData?.data || [];

  const createMutation = useCreateIntegrationMutation(projectId);
  const updateMutation = useUpdateIntegrationMutation(projectId);
  const deleteMutation = useDeleteIntegrationMutation(projectId);
  const validateMutation = useValidateIntegrationMutation(projectId);
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

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta integração?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleAdd = (type: IntegrationType) => {
    setEditingIntegration(undefined);
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const handleEdit = (integration: StrapiIntegration) => {
    setEditingIntegration(integration);
    setSelectedType(integration.type);
    setIsModalOpen(true);
  };

  const handleValidate = async (id: string) => {
    try {
      const result = await validateMutation.mutateAsync(id);
      if (result.valid) {
        alert('Integração validada com sucesso!');
      } else {
        alert(`Erro na validação: ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Falha ao validar integração.');
    }
  };

  const handleProcess = async (id: string) => {
    try {
      await processMutation.mutateAsync(id);
      alert('Processamento iniciado!');
    } catch (err) {
      console.error(err);
      alert('Falha ao iniciar processamento.');
    }
  };

  const handleFormSubmit = async (values: IntegrationCreateInput) => {
    try {
      if (editingIntegration) {
        await updateMutation.mutateAsync({
          id: editingIntegration.documentId,
          data: values,
        });
      } else {
        await createMutation.mutateAsync({
          ...values,
          project: projectId as string,
        });
      }
      setIsModalOpen(false);
      setEditingIntegration(undefined);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingIntegration(undefined);
  };

  return {
    platforms,
    isLoading,
    isModalOpen,
    selectedType,
    editingIntegration,
    handleDelete,
    handleAdd,
    handleEdit,
    handleValidate,
    handleProcess,
    handleFormSubmit,
    handleModalClose,
  };
};
