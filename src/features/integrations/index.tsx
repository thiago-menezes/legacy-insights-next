'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, Modal, Tabs, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { useProjects } from '../projects/hooks';
import { useSelectedWorkspace } from '../workspaces/context';
import { UtmScripts } from './components/utm-scripts';
import { WebhookForm } from './components/webhook-form';
import { BREADCRUMBS, TABS } from './constants';
import { DeleteModal } from './delete-modal';
import { IntegrationForm } from './form';
import { useIntegrations } from './hooks';
import { PlatformCard } from './platform-card';
import styles from './styles.module.scss';
import { IntegrationTab } from './types';

export const Integrations = () => {
  const [activeTab, setActiveTab] = useState<IntegrationTab>('all');
  const { project } = useProjects();
  const {
    platforms,
    isLoading,
    isModalOpen,
    isDeleteModalOpen,
    selectedType,
    editingIntegration,
    integrationToDelete,
    handleDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleAdd,
    handleEdit,
    handleProcess,
    handleFormSubmit,
    handleModalClose,
    canCreateIntegration,
  } = useIntegrations(project?.documentId);
  const {
    selectedOrg,
    currentWorkspaceHasProjects,
    isLoading: isLoadingWorkspace,
  } = useSelectedWorkspace();

  const initialValues = useMemo(
    () => editingIntegration || { type: selectedType },
    [editingIntegration, selectedType],
  );

  const router = useRouter();

  // Filter platforms based on active tab
  const filteredPlatforms = platforms.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'ads') return p.category === 'ads';
    if (activeTab === 'webhooks') return p.category === 'webhooks';
    return false;
  });

  useEffect(() => {
    if (!isLoadingWorkspace && !currentWorkspaceHasProjects && selectedOrg) {
      router.push(`/workspaces/${selectedOrg.slug}`);
    }
  }, [isLoadingWorkspace, currentWorkspaceHasProjects, selectedOrg, router]);

  const handleDetails = (id: string) => {
    if (selectedOrg && project) {
      router.push(
        `/workspaces/${selectedOrg.slug}/${project.slug}/integrations/${id}`,
      );
    }
  };

  // Check if selected type is a webhook integration
  const isWebhookType = (type: string | undefined) => {
    return (
      type === 'hotmart' ||
      type === 'kiwify' ||
      type === 'kirvano' ||
      type === 'custom_webhook'
    );
  };

  const currentType = editingIntegration?.type || selectedType;
  const isWebhookIntegration = isWebhookType(currentType);

  if (isLoading) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Loader />
      </View>
    );
  }

  if (!project) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Text>Projeto não encontrado</Text>
      </View>
    );
  }

  return (
    <View>
      <PageTitle
        icon={<Icon name="folder" size={32} />}
        title={`Projeto: ${project.name}`}
        description={
          project.description || 'Gerencie as integrações deste projeto'
        }
        breadcrumbs={BREADCRUMBS.map((breadcrumb) => ({
          label: breadcrumb.label(project),
          href: breadcrumb?.href?.(project),
        }))}
      />

      <View paddingTop={4} gap={4}>
        <Text variant="featured-2" weight="medium">
          Integrações
        </Text>

        <Tabs
          variant="pills-elevated"
          value={activeTab}
          onChange={(tab) => setActiveTab(tab.value as IntegrationTab)}
        >
          <Tabs.List>
            {TABS.map((tab) => (
              <Tabs.Item key={tab.id} value={tab.id}>
                <View direction="row" align="center" gap={2}>
                  {tab.icon && <Icon name={tab.icon} size={16} />}
                  {tab.label}
                </View>
              </Tabs.Item>
            ))}
          </Tabs.List>
        </Tabs>
      </View>

      {(activeTab === 'ads' || activeTab === 'all') && (
        <View gap={4} paddingTop={6}>
          <Text variant="featured-2" weight="medium">
            Anúncios
          </Text>
          <div className={styles.platformsGrid}>
            {filteredPlatforms
              .filter((p) => p.category === 'ads')
              .map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                  onEdit={handleEdit}
                  onProcess={handleProcess}
                  onDetails={handleDetails}
                  canManage={canCreateIntegration}
                />
              ))}
          </div>
        </View>
      )}

      {(activeTab === 'webhooks' || activeTab === 'all') && (
        <View gap={4} paddingTop={6}>
          <Text variant="featured-2" weight="medium">
            Webhooks
          </Text>
          <div className={styles.platformsGrid}>
            {filteredPlatforms
              .filter((p) => p.category === 'webhooks')
              .map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                  onEdit={handleEdit}
                  onProcess={handleProcess}
                  onDetails={handleDetails}
                  canManage={canCreateIntegration}
                />
              ))}
          </div>
        </View>
      )}

      {activeTab === 'utms' && <UtmScripts projectId={project.documentId} />}

      <Modal active={isModalOpen} onClose={handleModalClose} size="m">
        <Modal.Title>
          {editingIntegration
            ? isWebhookIntegration
              ? 'Atualizar Webhook'
              : 'Atualizar Token'
            : 'Nova Integração'}
        </Modal.Title>

        {isWebhookIntegration ? (
          <WebhookForm
            projectId={project?.documentId}
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
          />
        ) : (
          <IntegrationForm
            projectId={project?.documentId}
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
          />
        )}
      </Modal>

      <DeleteModal
        active={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        integrationName={integrationToDelete?.name || ''}
      />
    </View>
  );
};
