import { Badge, View } from 'reshaped';
import { Icon } from '@/components/icon';
import styles from '../styles.module.scss';
import { CellWithChangeProps } from './types';

export const CellWithChange = ({
  value,
  previousValue,
  change,
  prefix = '',
  suffix = '',
}: CellWithChangeProps) => {
  const isPositive = change >= 0;

  return (
    <div className={styles.cellWithChange}>
      <View gap={2} direction="row" align="center">
        <span className={styles.cellValue}>
          {prefix}
          {value}
          {suffix}
        </span>

        <Badge
          variant="faded"
          color={isPositive ? 'positive' : 'critical'}
          icon={
            <Icon
              name={isPositive ? 'trending-up' : 'trending-down'}
              size={12}
            />
          }
          rounded
        >
          {isPositive ? '+' : ''} {change.toFixed(2).replace('.', ',')}%
        </Badge>
      </View>

      <span className={styles.cellPrevious}>
        {prefix}
        {previousValue}
        {suffix} período anterior
      </span>
    </div>
  );
};
