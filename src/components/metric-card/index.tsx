import { Badge, Card, Text, View } from 'reshaped';
import { Icon } from '@/components/icon';
import styles from './styles.module.scss';
import { MetricCardProps } from './types';
import { formatPercentage } from './utils';

export const MetricCard = ({
  title,
  value,
  previousValue,
  percentageChange,
  icon,
}: MetricCardProps) => {
  const isPositive = percentageChange !== undefined && percentageChange >= 0;
  const changeColor = isPositive ? 'positive' : 'critical';

  return (
    <Card padding={4} className={styles.card}>
      <View gap={3}>
        <View direction="row" align="center" gap={2}>
          <View direction="row" align="center" className={styles.titleBar}>
            {icon && (
              <View padding={2} borderRadius="small">
                <Icon name={icon} size={18} />
              </View>
            )}
            <Text variant="body-3" color="neutral-faded">
              {title}
            </Text>
          </View>

          {percentageChange !== undefined && (
            <Badge
              color={changeColor}
              variant="faded"
              icon={
                <Icon name={isPositive ? 'trending-up' : 'trending-down'} />
              }
              rounded
            >
              {formatPercentage(percentageChange)}
            </Badge>
          )}
        </View>

        <View gap={1}>
          <Text variant="title-6" weight="bold">
            {value}
          </Text>

          {(previousValue || percentageChange !== undefined) && (
            <View direction="row" align="center" gap={2}>
              {previousValue && (
                <Text variant="caption-1" color="neutral-faded">
                  {previousValue} no período anterior
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Card>
  );
};
