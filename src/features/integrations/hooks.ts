import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from 'reshaped';
import {
  IntegrationCreateInput,
  IntegrationType,
  StrapiIntegration,
} from '@/libs/api/services/integrations';
import { useProjectRealTime } from '@/libs/real-time/use-integration-real-time';
import {
  useCreateIntegrationMutation,
  useDeleteIntegrationMutation,
  useProcessIntegrationMutation,
  useUpdateIntegrationMutation,
} from './api/mutation';
import { useIntegrationsQuery } from './api/query';
import { PLATFORM_METADATA } from './constants';

export const useIntegrations = (projectId?: string) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<IntegrationType>('meta_ads');
  const [editingIntegration, setEditingIntegration] = useState<
    StrapiIntegration | undefined
  >(undefined);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [integrationToDelete, setIntegrationToDelete] = useState<
    | {
        id: string;
        name: string;
      }
    | undefined
  >(undefined);

  const { data: integrationsData, isLoading } = useIntegrationsQuery(projectId);
  const queryClient = useQueryClient();
  const { show } = useToast();

  const integrations = useMemo(
    () => integrationsData?.data || [],
    [integrationsData?.data],
  );

  useProjectRealTime(projectId || null, (data) => {
    // eslint-disable-next-line no-console
    console.log('[RealTime] Received update:', data);

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

  const handleDeleteClick = (id: string) => {
    const integration = integrations.find((i) => i.documentId === id);
    if (integration) {
      setIntegrationToDelete({
        id: integration.documentId,
        name: integration.name,
      });
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (integrationToDelete) {
      await deleteMutation.mutateAsync(integrationToDelete.id);
      setIsDeleteModalOpen(false);
      setIntegrationToDelete(undefined);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setIntegrationToDelete(undefined);
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

  const handleProcess = async (id: string) => {
    try {
      await processMutation.mutateAsync(id);
      show({
        title: 'Processamento',
        text: 'O Processamento foi iniciado com sucesso. Aguarde o término do processamento para continuar!',
        color: 'neutral',
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      show({
        title: 'Erro',
        text: 'Falha ao iniciar processamento.',
        color: 'critical',
      });
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
    isDeleteModalOpen,
    selectedType,
    editingIntegration,
    integrationToDelete,
    handleDelete: handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleAdd,
    handleEdit,
    handleProcess,
    handleFormSubmit,
    handleModalClose,
  };
};
