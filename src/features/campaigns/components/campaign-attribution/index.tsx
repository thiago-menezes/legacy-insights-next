'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge, Loader, Select, Table, Text, View } from 'reshaped';
import { useCampaignAttributionQuery } from '../../api/query';

interface CampaignAttributionProps {
  campaignId: string;
}

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

export const CampaignAttribution = ({
  campaignId,
}: CampaignAttributionProps) => {
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const { data, isLoading } = useCampaignAttributionQuery(campaignId);

  if (isLoading) {
    return (
      <View align="center" justify="center" paddingTop={6}>
        <Loader />
      </View>
    );
  }

  if (!data) {
    return null;
  }

  const attribution = data.data;

  // Filter events by platform
  const filteredEvents =
    platformFilter === 'all'
      ? attribution.matchedEvents
      : attribution.matchedEvents.filter(
          (event) => event.source === platformFilter,
        );

  // Get unique platforms from events
  const availablePlatforms = [
    ...new Set(attribution.matchedEvents.map((event) => event.source)),
  ];

  return (
    <View gap={4}>
      {/* ROAS Summary Cards */}
      <View direction="row" gap={4}>
        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
          grow
        >
          <Text color="neutral-faded" weight="medium">
            Investimento Total
          </Text>
          <Text variant="featured-2" weight="bold">
            {formatCurrency(attribution.totalSpend)}
          </Text>
        </View>

        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
          grow
        >
          <Text color="neutral-faded" weight="medium">
            Receita Atribuída
          </Text>
          <Text variant="featured-2" weight="bold" color="positive">
            {formatCurrency(attribution.totalRevenue)}
          </Text>
        </View>

        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
          grow
        >
          <Text color="neutral-faded" weight="medium">
            ROAS
          </Text>
          <Text variant="featured-2" weight="bold">
            {attribution.roas.toFixed(2)}x
          </Text>
          <Text color="neutral-faded">
            {attribution.roas > 1
              ? `Retorno de ${((attribution.roas - 1) * 100).toFixed(0)}%`
              : 'Prejuízo'}
          </Text>
        </View>

        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
          grow
        >
          <Text color="neutral-faded" weight="medium">
            Vendas Atribuídas
          </Text>
          <Text variant="featured-2" weight="bold">
            {attribution.salesCount}
          </Text>
        </View>
      </View>

      {/* Matched Events Table */}
      {attribution.matchedEvents.length > 0 && (
        <View>
          <View
            direction="row"
            justify="space-between"
            align="center"
            paddingBottom={3}
          >
            <View>
              <Text variant="featured-3" weight="medium">
                Eventos de Venda Atribuídos
              </Text>
              <Text color="neutral-faded">
                Vendas vinculadas a esta campanha via parâmetros UTM
              </Text>
            </View>

            {availablePlatforms.length > 1 && (
              <View width="200px">
                <Select
                  name="platformFilter"
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.value)}
                >
                  <option value="all">Todas as Plataformas</option>
                  {availablePlatforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </option>
                  ))}
                </Select>
              </View>
            )}
          </View>

          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Cell>Plataforma</Table.Cell>
                <Table.Cell>Produto</Table.Cell>
                <Table.Cell>Tipo de Evento</Table.Cell>
                <Table.Cell>Valor</Table.Cell>
                <Table.Cell>UTM Source</Table.Cell>
                <Table.Cell>UTM Campaign</Table.Cell>
                <Table.Cell>Data</Table.Cell>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {filteredEvents.map((event) => (
                <Table.Row key={event.id}>
                  <Table.Cell>
                    <Badge color={getPlatformColor(event.source)}>
                      {event.source}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{event.product?.name || '-'}</Text>
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
      )}

      {attribution.matchedEvents.length === 0 && (
        <View align="center" justify="center" paddingTop={6} paddingBottom={6}>
          <Text color="neutral-faded">
            Nenhum evento de venda foi atribuído a esta campanha ainda.
          </Text>
          <Text color="neutral-faded">
            Vendas serão vinculadas automaticamente quando os parâmetros UTM
            corresponderem ao nome ou ID desta campanha.
          </Text>
        </View>
      )}
    </View>
  );
};
