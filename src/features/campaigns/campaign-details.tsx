'use client';

import { useParams, useRouter } from 'next/navigation';
import { Badge, Button, Loader, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { CampaignAttribution } from './components/campaign-attribution';

export const CampaignDetails = () => {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.campaignId as string;
  const client = params?.client as string;

  if (!campaignId) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Loader />
      </View>
    );
  }

  return (
    <View>
      <PageTitle
        icon={<Icon name="chart-line" size={32} />}
        title="Detalhes da Campanha"
        description={`Campanha ${client === 'meta' ? 'Meta' : 'Google'} Ads`}
      />

      <View paddingTop={4} gap={6}>
        {/* Header with back button */}
        <View direction="row" justify="space-between" align="center">
          <Badge color={client === 'meta' ? 'primary' : 'critical'}>
            {client === 'meta' ? 'Meta Ads' : 'Google Ads'}
          </Badge>
          <Button variant="ghost" onClick={() => router.back()}>
            <View direction="row" align="center" gap={2}>
              <Icon name="arrow-left" size={16} />
              Voltar
            </View>
          </Button>
        </View>

        {/* Attribution Section */}
        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
        >
          <View paddingBottom={4}>
            <Text variant="featured-2" weight="medium">
              Atribuição de Vendas e ROAS
            </Text>
            <Text color="neutral-faded">
              Análise de retorno sobre investimento e eventos de venda
              atribuídos
            </Text>
          </View>

          <CampaignAttribution campaignId={campaignId} />
        </View>

        {/* Placeholder for future campaign metrics */}
        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
        >
          <Text variant="featured-3" weight="medium">
            Métricas da Campanha
          </Text>
          <View paddingTop={3}>
            <Text color="neutral-faded">
              Métricas detalhadas da campanha serão exibidas aqui.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
