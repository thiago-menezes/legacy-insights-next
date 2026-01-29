'use client';

import { useParams, useRouter } from 'next/navigation';
import { View, Text, Button, Loader, Badge, Divider } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { useIntegrationDetails } from './hooks';
import styles from './styles.module.scss';

export const IntegrationDetails = () => {
  const params = useParams();
  const integrationId = params.integrationId as string;

  const router = useRouter();
  const {
    data: integration,
    isLoading,
    error,
  } = useIntegrationDetails(integrationId);

  if (isLoading) {
    return (
      <View align="center" justify="center" height="100vh">
        <Loader />
      </View>
    );
  }

  if (error || !integration) {
    return (
      <View align="center" justify="center" height="100vh" gap={4}>
        <Text color="critical" variant="featured-3">
          Erro ao carregar integração
        </Text>
        <Button onClick={() => router.back()}>Voltar</Button>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'finalizado com sucesso':
        return 'positive';
      case 'processando':
      case 'pending':
        return 'primary';
      case 'error':
      case 'failed':
      case 'erro':
        return 'critical';
      default:
        return 'neutral';
    }
  };

  return (
    <View gap={6}>
      <View direction="row" align="center" gap={4}>
        <PageTitle
          icon={
            <Button
              variant="ghost"
              icon={<Icon name="arrow-left" size={20} />}
              onClick={() => router.back()}
            />
          }
          title={integration.name}
          description="Detalhes da implementação e logs"
        />
      </View>

      <View maxWidth="600px" gap={6}>
        <Text variant="featured-3" weight="bold">
          Status da Integração
        </Text>

        <View direction="row" gap={10}>
          <View gap={2}>
            <Text color="neutral-faded" variant="caption-1">
              STATUS DE CONEXÃO
            </Text>
            <Badge color={getStatusColor(integration.status)} variant="faded">
              {integration.status}
            </Badge>
          </View>

          <View gap={2}>
            <Text color="neutral-faded" variant="caption-1">
              STATUS DE PROCESSAMENTO
            </Text>
            <Badge
              color={getStatusColor(integration.processStatus || '')}
              variant="faded"
            >
              {integration.processStatus || 'N/A'}
            </Badge>
          </View>
        </View>

        <Divider />

        <View gap={4}>
          <Text variant="featured-3" weight="bold">
            Logs e Datas
          </Text>

          <View
            className={styles.logItem}
            direction="row"
            justify="space-between"
          >
            <Text>Última Sincronização</Text>
            <Text weight="medium">
              {integration.lastSyncAt
                ? new Date(integration.lastSyncAt).toLocaleString('pt-BR')
                : 'Nunca'}
            </Text>
          </View>

          <View
            className={styles.logItem}
            direction="row"
            justify="space-between"
          >
            <Text>Status da Última Sincronização</Text>
            <Badge
              size="small"
              color={getStatusColor(integration.lastSyncStatus || '')}
            >
              {integration.lastSyncStatus || 'N/A'}
            </Badge>
          </View>

          <View
            className={styles.logItem}
            direction="row"
            justify="space-between"
          >
            <Text>Expiração do Token</Text>
            <Text weight="medium">
              {integration.tokenExpiresAt
                ? new Date(integration.tokenExpiresAt).toLocaleString('pt-BR')
                : 'N/A'}
            </Text>
          </View>

          {integration.errorMessage && (
            <View className={styles.logItem} gap={2}>
              <Text color="critical" weight="bold">
                Erro Recente:
              </Text>
              <Text color="critical" variant="body-3">
                {integration.errorMessage}
              </Text>
            </View>
          )}
        </View>

        <Divider />

        <View gap={4}>
          <Text variant="featured-3" weight="bold">
            Configuração
          </Text>
          <View
            className={styles.logItem}
            direction="row"
            justify="space-between"
          >
            <Text>Plataforma</Text>
            <Text weight="medium">{integration.type}</Text>
          </View>
          <View
            className={styles.logItem}
            direction="row"
            justify="space-between"
          >
            <Text>ID da Integração</Text>
            <Text weight="medium" color="neutral-faded">
              {integration.documentId}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
