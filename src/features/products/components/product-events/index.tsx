'use client';

import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge, Loader, Table, Text, View } from 'reshaped';
import { useProductEvents } from './hooks';
import { ProductEventsProps } from './types';

const formatCurrency = (amount: number, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(amount);
};

const getPlatformColor = (
  source: string,
): 'neutral' | 'positive' | 'primary' | 'critical' => {
  const colors: Record<
    string,
    'neutral' | 'positive' | 'primary' | 'critical'
  > = {
    hotmart: 'critical',
    kiwify: 'positive',
    kirvano: 'primary',
    custom: 'neutral',
  };
  return colors[source] || 'neutral';
};

export const ProductEvents = ({ productId }: ProductEventsProps) => {
  const { events, isLoading } = useProductEvents(productId);

  if (isLoading) {
    return (
      <View align="center" justify="center" paddingTop={6}>
        <Loader />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View align="center" justify="center" paddingTop={6} paddingBottom={6}>
        <Text color="neutral-faded">
          Nenhum evento de webhook registrado para este produto.
        </Text>
      </View>
    );
  }

  return (
    <View>
      <View paddingBottom={3}>
        <Text variant="featured-3" weight="medium">
          Eventos de Webhook ({events.length})
        </Text>
        <Text color="neutral-faded">
          Histórico de vendas e eventos recebidos via webhook
        </Text>
      </View>

      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Plataforma</Table.Cell>
            <Table.Cell>Tipo de Evento</Table.Cell>
            <Table.Cell>Valor</Table.Cell>
            <Table.Cell>UTM Source</Table.Cell>
            <Table.Cell>UTM Medium</Table.Cell>
            <Table.Cell>UTM Campaign</Table.Cell>
            <Table.Cell>Processado</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {events.map((event) => (
            <Table.Row key={event.id}>
              <Table.Cell>
                <Badge color={getPlatformColor(event.source)}>
                  {event.source}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Text weight="medium">{event.eventType}</Text>
              </Table.Cell>
              <Table.Cell>
                {event.amount ? (
                  <Text weight="medium" color="positive">
                    {formatCurrency(event.amount)}
                  </Text>
                ) : (
                  '-'
                )}
              </Table.Cell>
              <Table.Cell>
                <Text>{event.utmSource || '-'}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text>{event.utmMedium || '-'}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text>{event.utmCampaign || '-'}</Text>
              </Table.Cell>
              <Table.Cell>
                <Text color="neutral-faded">
                  {formatDistanceToNow(new Date(event.processedAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </View>
  );
};
