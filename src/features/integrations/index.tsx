'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { View, Text, Tabs, Loader, Modal } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { useProjects } from '../projects/hooks';
import { useSelectedWorkspace } from '../workspaces/context';
import { BREADCRUMBS, TABS } from './constants';
import { DeleteModal } from './delete-modal';
import { IntegrationForm } from './form';
import { useIntegrations } from './hooks';
import { PlatformCard } from './platform-card';
import styles from './styles.module.scss';

export const Integrations = () => {
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
    handleValidate,
    handleProcess,
    handleFormSubmit,
    handleModalClose,
  } = useIntegrations(project?.documentId);
  const {
    selectedOrg,
    currentWorkspaceHasProjects,
    isLoading: isLoadingWorkspace,
  } = useSelectedWorkspace();

  const router = useRouter();

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

        <Tabs variant="pills-elevated" defaultValue="all">
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

      <View gap={4} paddingTop={4}>
        <Text variant="featured-2" weight="medium">
          Anúncios
        </Text>

        <div className={styles.platformsGrid}>
          {platforms
            .filter((p) => p.category === 'ads')
            .map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                onDelete={handleDelete}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onValidate={handleValidate}
                onProcess={handleProcess}
                onDetails={handleDetails}
              />
            ))}
        </div>
      </View>

      <Modal active={isModalOpen} onClose={handleModalClose} size="m">
        <Modal.Title>
          {editingIntegration ? 'Atualizar Token' : 'Nova Integração'}
        </Modal.Title>

        <IntegrationForm
          projectId={project?.documentId}
          initialValues={editingIntegration || { type: selectedType }}
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
        />
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
