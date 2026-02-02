'use client';

import { useParams, useRouter } from 'next/navigation';
import { Badge, Button, Loader, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import { PageTitle } from '@/components/page-title';
import { useProductQuery } from './api/query';
import { ProductEvents } from './components/product-events';

export const ProductDetails = () => {
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId as string;

  const { data: product, isLoading } = useProductQuery(productId);

  if (isLoading) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Loader />
      </View>
    );
  }

  if (!product) {
    return (
      <View align="center" justify="center" paddingTop={10}>
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <View>
      <PageTitle
        icon={<Icon name="package" size={32} />}
        title={product.name}
        description={`Detalhes do produto ${product.platform}`}
      />

      <View paddingTop={4} gap={6}>
        {/* Product Information Card */}
        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
          gap={3}
        >
          <View direction="row" justify="space-between" align="center">
            <Text variant="featured-2" weight="medium">
              Informações do Produto
            </Text>
            <Button variant="ghost" onClick={() => router.back()}>
              <View direction="row" align="center" gap={2}>
                <Icon name="arrow-left" size={16} />
                Voltar
              </View>
            </Button>
          </View>

          <View gap={2}>
            <View direction="row" gap={2} align="center">
              <Text weight="medium" color="neutral-faded">
                Plataforma:
              </Text>
              <Badge color="neutral">{product.platform}</Badge>
            </View>

            {product.price && (
              <View direction="row" gap={2} align="center">
                <Text weight="medium" color="neutral-faded">
                  Preço:
                </Text>
                <Text weight="medium">
                  {product.currency || 'BRL'} {product.price.toFixed(2)}
                </Text>
              </View>
            )}

            {product.externalId && (
              <View direction="row" gap={2} align="center">
                <Text weight="medium" color="neutral-faded">
                  ID Externo:
                </Text>
                <Text>{product.externalId}</Text>
              </View>
            )}

            <View direction="row" gap={2} align="center">
              <Text weight="medium" color="neutral-faded">
                Status:
              </Text>
              <Badge color={product.active ? 'positive' : 'neutral'}>
                {product.active ? 'Ativo' : 'Inativo'}
              </Badge>
            </View>

            {product.project && (
              <View direction="row" gap={2} align="center">
                <Text weight="medium" color="neutral-faded">
                  Projeto:
                </Text>
                <Text>{product.project.name}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Webhook Events Section */}
        <View
          padding={4}
          borderRadius="medium"
          backgroundColor="elevation-base"
        >
          <ProductEvents productId={productId} />
        </View>
      </View>
    </View>
  );
};
