'use client';

import Image from 'next/image';
import { Card, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import styles from './styles.module.scss';
import { AdListProps } from './types';
import { formatNumber, formatPercentage } from './utils';

export const AdList = ({ title, ads }: AdListProps) => {
  return (
    <Card padding={4}>
      <View gap={3}>
        <Text variant="featured-3" weight="medium">
          {title}
        </Text>

        <View>
          {ads.map((ad) => (
            <div key={ad.id} className={styles.adItem}>
              {ad.imageUrl ? (
                <Image
                  src={ad.imageUrl}
                  alt={ad.name}
                  className={styles.adImage}
                />
              ) : (
                <View
                  backgroundColor="neutral-faded"
                  borderRadius="small"
                  align="center"
                  justify="center"
                  className={styles.adImage}
                  attributes={{
                    style: { width: 48, height: 48 },
                  }}
                >
                  <Icon name="photo" size={20} />
                </View>
              )}

              <div className={styles.adInfo}>
                <Text variant="body-3" weight="medium">
                  {ad.name}
                </Text>
                <View direction="row" align="center" gap={2}>
                  <Icon name="click" size={14} />
                  <Text variant="caption-1" color="neutral-faded">
                    {formatNumber(ad.clicks)} cliques
                  </Text>
                </View>
              </div>

              <View direction="row" align="center" gap={1}>
                <Icon name="trending-up" size={14} />
                <Text variant="body-3" color="positive" weight="medium">
                  {formatPercentage(ad.percentage)}
                </Text>
              </View>
            </div>
          ))}
        </View>
      </View>
    </Card>
  );
};
