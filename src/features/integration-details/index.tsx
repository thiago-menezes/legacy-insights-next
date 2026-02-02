'use client';

import { useParams, useRouter } from 'next/navigation';
import { Badge, Button, Divider, Loader, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import {
  HotmartConfig,
  KirvanoConfig,
  KiwifyConfig,
} from '@/features/integrations/components/webhook-configs';
import { WebhookEvents } from '@/features/integrations/components/webhook-events';
import { WebhookTester } from '@/features/integrations/components/webhook-tester';
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
    updateIntegration,
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

  const isWebhookIntegration = [
    'hotmart',
    'kiwify',
    'kirvano',
    'custom_webhook',
  ].includes(integration.type);

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

          {isWebhookIntegration && (
            <View className={styles.logItem} gap={2}>
              <Text weight="medium">Webhook URL</Text>
              <View
                padding={2}
                borderRadius="small"
                backgroundColor="neutral-faded"
              >
                <Text variant="caption-1" color="neutral">
                  {`${process.env.STRAPI_URL}/api/webhooks/${integration.type}/${integrationId}`}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Platform-Specific Webhook Configuration */}
      {isWebhookIntegration && (
        <View maxWidth="100%">
          <Divider />
          <View paddingTop={6} gap={6}>
            {integration.type === 'kiwify' && (
              <KiwifyConfig
                webhookUrl={`${process.env.STRAPI_URL}/api/webhooks/kiwify/${integrationId}`}
                onUpdateSecret={(secret) =>
                  updateIntegration({
                    id: integrationId,
                    webhookSecret: secret,
                  })
                }
                initialSecret={integration.webhookSecret}
              />
            )}
            {integration.type === 'hotmart' && (
              <HotmartConfig
                webhookUrl={`${process.env.STRAPI_URL}/api/webhooks/hotmart/${integrationId}`}
                onUpdateSecret={(secret) =>
                  updateIntegration({
                    id: integrationId,
                    webhookSecret: secret,
                  })
                }
                initialSecret={integration.webhookSecret}
              />
            )}
            {integration.type === 'kirvano' && (
              <KirvanoConfig
                webhookUrl={`${process.env.STRAPI_URL}/api/webhooks/kirvano/${integrationId}`}
                onUpdateSecret={(secret) =>
                  updateIntegration({
                    id: integrationId,
                    webhookSecret: secret,
                  })
                }
                initialSecret={integration.webhookSecret}
              />
            )}
            {integration.type === 'custom_webhook' && (
              <View className={styles.logItem} gap={2}>
                <Text weight="medium">Webhook URL</Text>
                <View
                  padding={2}
                  borderRadius="small"
                  backgroundColor="neutral-faded"
                >
                  <Text variant="caption-1" color="neutral">
                    {`${process.env.STRAPI_URL}/api/webhooks/custom/${integrationId}`}
                  </Text>
                </View>
              </View>
            )}

            <Divider />

            <WebhookTester
              webhookUrl={`${process.env.STRAPI_URL}/api/webhooks/${integration.type === 'custom_webhook' ? 'custom' : integration.type}/${integrationId}`}
              source={
                integration.type === 'custom_webhook'
                  ? 'custom'
                  : integration.type
              }
              secret={integration.webhookSecret}
            />
          </View>
        </View>
      )}

      {/* Webhook Events Section */}
      {isWebhookIntegration && (
        <View maxWidth="100%">
          <Divider />
          <View paddingTop={6}>
            <WebhookEvents integrationId={integrationId} />
          </View>
        </View>
      )}
    </View>
  );
};
