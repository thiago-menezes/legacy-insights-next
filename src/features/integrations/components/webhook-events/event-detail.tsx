'use client';

import { Button, Modal, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import styles from './styles.module.scss';
import { EventDetailProps } from './types';

export const EventDetail = ({ event, isOpen, onClose }: EventDetailProps) => {
  if (!event) return null;

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(event.payload, null, 2),
      );
    } catch {
      // Silent fail
    }
  };

  return (
    <Modal active={isOpen} onClose={onClose} size="l">
      <Modal.Title>Detalhes do Evento</Modal.Title>

      <View gap={4} paddingTop={4}>
        {/* Event Metadata */}
        <View gap={2}>
          <View direction="row" gap={2} align="center">
            <Text variant="body-2" weight="medium">
              Tipo:
            </Text>
            <span className={styles.eventTypeBadge}>{event.eventType}</span>
          </View>

          {event.externalId && (
            <View direction="row" gap={2}>
              <Text variant="body-2" weight="medium">
                ID Externo:
              </Text>
              <Text variant="body-2">{event.externalId}</Text>
            </View>
          )}

          {event.amount && (
            <View direction="row" gap={2}>
              <Text variant="body-2" weight="medium">
                Valor:
              </Text>
              <Text variant="body-2">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(event.amount)}
              </Text>
            </View>
          )}

          <View direction="row" gap={2}>
            <Text variant="body-2" weight="medium">
              Processado em:
            </Text>
            <Text variant="body-2">
              {new Date(event.processedAt).toLocaleString('pt-BR')}
            </Text>
          </View>
        </View>

        {/* Product Information */}
        {event.product && (
          <View
            padding={3}
            borderRadius="medium"
            backgroundColor="neutral-faded"
            gap={1}
          >
            <Text variant="caption-1" color="neutral-faded" weight="medium">
              PRODUTO
            </Text>
            <Text variant="body-1" weight="medium">
              {event.product.name}
            </Text>
          </View>
        )}

        {/* UTM Parameters */}
        {(event.utmSource || event.utmMedium || event.utmCampaign) && (
          <View gap={2}>
            <Text variant="body-2" weight="medium">
              Parâmetros UTM
            </Text>
            <View gap={1}>
              {event.utmSource && (
                <Text variant="caption-1">Source: {event.utmSource}</Text>
              )}
              {event.utmMedium && (
                <Text variant="caption-1">Medium: {event.utmMedium}</Text>
              )}
              {event.utmCampaign && (
                <Text variant="caption-1">Campaign: {event.utmCampaign}</Text>
              )}
            </View>
          </View>
        )}

        {/* JSON Payload */}
        <View gap={2}>
          <View direction="row" justify="space-between" align="center">
            <Text variant="body-2" weight="medium">
              Payload Completo
            </Text>
            <Button
              variant="ghost"
              size="small"
              icon={<Icon name="copy" />}
              onClick={handleCopyPayload}
            >
              Copiar
            </Button>
          </View>

          <div className={styles.jsonViewer}>
            <pre className={styles.jsonContent}>
              {JSON.stringify(event.payload, null, 2)}
            </pre>
          </div>
        </View>
      </View>

      <View direction="row" justify="end" paddingTop={4}>
        <Button onClick={onClose}>Fechar</Button>
      </View>
    </Modal>
  );
};
