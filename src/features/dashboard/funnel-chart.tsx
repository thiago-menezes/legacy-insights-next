'use client';

import { Card, View, Text, Button } from 'reshaped';
import { Icon } from '@/components/icon';
import styles from './styles.module.scss';
import { FunnelChartProps } from './types';
import { formatNumber, getBarColor } from './utils';

export const FunnelChart = ({
  title,
  stages,
  previousStages,
  periodLabel,
  previousPeriodLabel,
}: FunnelChartProps) => {
  const isComparison = !!previousStages && previousStages.length > 0;

  const currentMax = Math.max(...stages.map((s) => s.value));
  const previousMax = isComparison
    ? Math.max(...(previousStages?.map((s) => s.value) || []))
    : 0;
  const maxValue = Math.max(currentMax, previousMax);

  return (
    <Card padding={4} className={styles.card}>
      <View gap={4}>
        <View align="center">
          <Text variant="featured-3" weight="medium">
            {title}
          </Text>

          {isComparison && (
            <View direction="row" gap={4} padding={4}>
              <View
                direction="row"
                align="center"
                gap={2}
                className={styles.legendItem}
              >
                <Button variant="outline" icon={<Icon name="calendar" />}>
                  {previousPeriodLabel}
                </Button>
              </View>
              <View
                direction="row"
                align="center"
                gap={2}
                className={styles.legendItem}
              >
                <Button variant="outline" icon={<Icon name="calendar" />}>
                  {periodLabel}
                </Button>
              </View>
            </View>
          )}
        </View>

        <View gap={2}>
          {stages.map((stage, index) => {
            const percentage = (stage.value / maxValue) * 100;
            const color = getBarColor(index);

            if (isComparison && previousStages) {
              const prevStage = previousStages[index];
              const prevPercentage = prevStage
                ? (prevStage.value / maxValue) * 100
                : 0;

              return (
                <View key={stage.name} direction="row" align="center" gap={2}>
                  {/* Previous Period (Left) */}
                  <View
                    grow
                    direction="row"
                    align="center"
                    justify="end"
                    gap={2}
                    attributes={{ style: { flexBasis: 0 } }}
                  >
                    <View
                      grow
                      attributes={{
                        style: { display: 'flex', justifyContent: 'flex-end' },
                      }}
                    >
                      <Text variant="body-3" color="neutral-faded">
                        {stage.name}
                      </Text>
                      <View
                        className={styles.funnelBar}
                        height="24px"
                        attributes={{
                          style: {
                            width: `${prevPercentage}%`,
                            backgroundColor: color,
                            minWidth: 4,
                            marginLeft: 8,
                          },
                        }}
                      />
                    </View>
                  </View>

                  <View
                    grow
                    direction="row"
                    align="center"
                    justify="start"
                    gap={2}
                    attributes={{ style: { flexBasis: 0 } }}
                  >
                    <View
                      grow
                      attributes={{
                        style: {
                          display: 'flex',
                          justifyContent: 'flex-start',
                        },
                      }}
                    >
                      <View
                        className={styles.funnelBar}
                        height="24px"
                        attributes={{
                          style: {
                            width: `${percentage}%`,
                            backgroundColor: color,
                            minWidth: 4,
                            marginRight: 8,
                          },
                        }}
                      />

                      <Text variant="body-3" color="neutral-faded">
                        {stage.name}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }

            // Default Single View
            return (
              <View key={stage.name} gap={1}>
                <View direction="row" justify="space-between" align="center">
                  <Text variant="body-3" color="neutral-faded">
                    {stage.name}
                  </Text>
                  <Text variant="body-3" weight="medium">
                    {formatNumber(stage.value)}
                  </Text>
                </View>

                <View
                  backgroundColor="neutral-faded"
                  borderRadius="small"
                  height={8}
                  attributes={{ style: { overflow: 'hidden' } }}
                >
                  <View
                    height="100%"
                    borderRadius="small"
                    className={styles.funnelBar}
                    attributes={{
                      style: {
                        width: `${percentage}%`,
                        backgroundColor: color,
                      },
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </Card>
  );
};
