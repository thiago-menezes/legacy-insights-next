import { IconProps } from '../icon';

export interface MetricCardProps {
  title: string;
  value: string;
  previousValue?: string;
  percentageChange?: number;
  icon?: IconProps['name'];
}
