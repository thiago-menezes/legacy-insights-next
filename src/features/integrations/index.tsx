import Image from 'next/image';
import { useState } from 'react';
import { View, Text, Tabs, Loader, Modal, Button } from 'reshaped';
import { Icon } from '@/components/icon';
import { IntegrationType } from '@/libs/api/services/integrations';
import { STATUS_CONFIG, TABS } from './constants';
import { IntegrationForm } from './form';
import { useIntegrations } from './hooks';
import styles from './styles.module.scss';
import { IntegrationPlatform, IntegrationProfile } from './types';

interface IntegrationsProps {
  projectId: string;
}

interface ProfileItemProps {
  profile: IntegrationProfile;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
}

const ProfileItem = ({ profile, onDelete, onUpdate }: ProfileItemProps) => {
  const statusConfig =
    STATUS_CONFIG[profile.status] || STATUS_CONFIG.disconnected;

  return (
    <div className={styles.profileItem}>
      <Text variant="body-2" weight="medium" className={styles.profileName}>
        {profile.name}
      </Text>

      <div className={styles.profileStatus}>
        <span
          className={`${styles.statusDot} ${
            profile.status === 'connected'
              ? styles.statusDot_connected
              : styles.statusDot_disconnected
          }`}
        />
        <Text
          variant="body-2"
          color={
            statusConfig.color === 'positive' ? 'positive' : 'neutral-faded'
          }
        >
          {statusConfig.label}
        </Text>
      </div>

      <div className={styles.profileActions}>
        <Button
          variant="outline"
          aria-label="Configurações"
          onClick={() => onUpdate(profile.id)}
        >
          <Icon name="settings" size={18} />
        </Button>

        <Button
          variant="outline"
          aria-label="Remover"
          color="critical"
          onClick={() => onDelete(profile.id)}
        >
          <Icon name="trash" size={18} />
        </Button>
      </div>
    </div>
  );
};

interface PlatformCardProps {
  platform: IntegrationPlatform;
  onDelete: (id: string) => void;
  onAdd: (type: string) => void;
  onUpdate: (id: string) => void;
}

const PlatformCard = ({
  platform,
  onDelete,
  onAdd,
  onUpdate,
}: PlatformCardProps) => {
  return (
    <div className={styles.platformCard}>
      <div className={styles.platformHeader}>
        <div className={styles.platformIcon}>
          {platform.icon.startsWith('/') ? (
            <Image
              src={platform.icon}
              width={40}
              height={40}
              alt={platform.name}
              priority
              className={styles.iconIntegration}
            />
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Icon name={platform.icon as any} size={40} />
          )}
        </div>
        <div className={styles.platformInfo}>
          <Text variant="body-1" weight="bold">
            {platform.name}
          </Text>
          <Text variant="body-2" color="neutral-faded">
            {platform.description}
          </Text>
        </div>
      </div>

      <div className={styles.profilesList}>
        {platform.profiles.map((profile) => (
          <ProfileItem
            key={profile.id}
            profile={profile}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}

        <Button
          className={styles.addProfileButton}
          onClick={() => onAdd(platform.id)}
        >
          <Icon name="plus" size={18} />
          Adicionar novo perfil
        </Button>
      </div>
    </div>
  );
};

export const Integrations = ({ projectId }: IntegrationsProps) => {
  const { integrations, isLoading, deleteIntegration, createIntegration } =
    useIntegrations(projectId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<IntegrationType>('meta_ads');

  const platforms: IntegrationPlatform[] = [
    {
      id: 'meta_ads',
      name: 'Meta Ads',
      description: 'Conecte seus perfis do Meta Ads',
      icon: '/icon-meta.png',
      category: 'ads',
      profiles: integrations
        .filter((i) => i.type === 'meta_ads')
        .map((i) => ({
          id: i.documentId,
          name: i.name,
          status: i.status === 'connected' ? 'connected' : 'disconnected',
        })),
    },
    {
      id: 'google_ads',
      name: 'Google Ads',
      description: 'Conecte seus perfis do Google Ads',
      icon: '/icon-google.png',
      category: 'ads',
      profiles: integrations
        .filter((i) => i.type === 'google_ads')
        .map((i) => ({
          id: i.documentId,
          name: i.name,
          status: i.status === 'connected' ? 'connected' : 'disconnected',
        })),
    },
  ];

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover esta integração?')) {
      await deleteIntegration(id);
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
      await createIntegration(values as any);
      setIsModalOpen(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Loader />
      </View>
    );
  }

  return (
    <View>
      <View gap={2}>
        <Text variant="title-6" weight="medium">
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
                onUpdate={handleUpdate}
              />
            ))}
        </div>
      </View>

      <Modal active={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Title>Nova Integração</Modal.Title>

        <IntegrationForm
          projectId={projectId}
          initialValues={{ type: selectedType }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit={handleFormSubmit as any}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </View>
  );
};
