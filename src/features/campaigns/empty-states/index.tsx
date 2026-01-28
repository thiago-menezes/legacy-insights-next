import { useRouter } from 'next/navigation';
import { View } from 'reshaped';
import { EmptyState } from '@/components/empty-state';
import { CampaignsHeader } from '../header';
import styles from './styles.module.scss';
import { CampaignsEmptyStateProps } from './types';

const getEmptyStateConfig = (platform: 'meta' | 'google') => {
  const platformName = platform === 'meta' ? 'Meta Ads' : 'Google Ads';

  return {
    'no-project': {
      icon: 'folder' as const,
      title: 'Nenhum projeto encontrado',
      description:
        'Para visualizar as campanhas, é necessário criar um projeto no workspace atual.',
      actionLabel: 'Criar Projeto',
      getUrl: (props: CampaignsEmptyStateProps) => props.projectsPageUrl,
    },
    'no-integration': {
      icon: 'plug-connected' as const,
      title: `Integração com ${platformName} não configurada`,
      description: `Para visualizar as campanhas, é necessário configurar a integração com o ${platformName}.`,
      actionLabel: 'Configurar Integração',
      getUrl: (props: CampaignsEmptyStateProps) => props.integrationsPageUrl,
    },
    'no-data': {
      icon: 'speakerphone' as const,
      title: 'Nenhuma campanha encontrada',
      description: `Ainda não há campanhas sincronizadas do ${platformName}. Os dados aparecerão aqui após a sincronização com sua conta de anúncios.`,
      actionLabel: undefined,
      getUrl: () => '',
    },
  };
};

export const CampaignsEmptyState = (props: CampaignsEmptyStateProps) => {
  const router = useRouter();
  const { state, platform } = props;

  const emptyStateConfig = getEmptyStateConfig(platform);
  const config = emptyStateConfig[state];

  const handleAction = () => {
    const url = config.getUrl(props);
    if (url) {
      router.push(url);
    }
  };

  return (
    <View gap={6}>
      <CampaignsHeader />

      <View className={styles.container}>
        <EmptyState
          icon={config.icon}
          title={config.title}
          description={config.description}
          actionLabel={config.actionLabel}
          onAction={config.actionLabel ? handleAction : undefined}
        />
      </View>
    </View>
  );
};
