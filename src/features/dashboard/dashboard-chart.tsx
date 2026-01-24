'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, View, Text, Button } from 'reshaped';
import { Icon } from '@/components/icon';
import { CHART_COLORS } from './constants';
import styles from './styles.module.scss';
import { DashboardChartProps } from './types';
import { formatCurrency, formatPercentage } from './utils';

export const DashboardChart = ({
  title,
  subtitle,
  percentageChange,
  data,
  type,
}: DashboardChartProps) => {
  const isInvestmentRevenue = type === 'investment-revenue';

  const primaryKey = isInvestmentRevenue ? 'investment' : 'capture';
  const secondaryKey = isInvestmentRevenue ? 'revenue' : 'sale';

  const primaryColor = CHART_COLORS.primary;
  const secondaryColor = isInvestmentRevenue
    ? CHART_COLORS.revenue
    : CHART_COLORS.sale;

  const primaryLabel = isInvestmentRevenue ? 'Investimento' : 'Captação';
  const secondaryLabel = isInvestmentRevenue ? 'Receita' : 'Venda';

  return (
    <Card padding={4}>
      <View gap={4}>
        <View direction="row" align="center" justify="space-between" gap={4}>
          <View gap={1}>
            <Text variant="featured-3" weight="medium">
              {title}
            </Text>
            {subtitle && (
              <Text variant="body-3" color="neutral-faded">
                {subtitle}
              </Text>
            )}
          </View>

          <View direction="row" align="center" gap={4}>
            {percentageChange !== undefined && (
              <View
                backgroundColor={
                  percentageChange >= 0 ? 'positive-faded' : 'critical-faded'
                }
                paddingInline={3}
                paddingBlock={1}
                borderRadius="medium"
                direction="row"
                align="center"
                gap={2}
              >
                <Text color={percentageChange >= 0 ? 'positive' : 'critical'}>
                  <Icon
                    name={
                      percentageChange >= 0 ? 'trending-up' : 'trending-down'
                    }
                    size={20}
                  />
                </Text>
                <Text
                  variant="body-2"
                  color={percentageChange >= 0 ? 'positive' : 'critical'}
                  weight="medium"
                >
                  {formatPercentage(percentageChange, false)}
                </Text>
              </View>
            )}
            <Button
              variant="outline"
              endIcon={<Icon name="chevron-down" />}
              size="medium"
            >
              Mês
            </Button>
          </View>
        </View>

        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--rs-color-background-elevated)',
                  border: '1px solid var(--rs-color-border-neutral-faded)',
                  borderRadius: '8px',
                  boxShadow: 'var(--rs-shadow-overlay)',
                  zIndex: 99999,
                }}
                labelStyle={{ color: 'var(--rs-color-foreground-neutral)' }}
                formatter={(value) => [formatCurrency(value as number), '']}
              />
              <defs>
                <linearGradient
                  id={`gradient-${primaryKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={primaryColor}
                    stopOpacity={0.3}
                  />
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id={`gradient-${secondaryKey}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={secondaryColor}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={secondaryColor}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--rs-color-border-neutral-faded)"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: 'var(--rs-color-foreground-neutral-faded)',
                  fontSize: 12,
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: 'var(--rs-color-foreground-neutral-faded)',
                  fontSize: 12,
                }}
                tickFormatter={(value) => `${value / 1000}k`}
              />

              <Area
                type="monotone"
                dataKey={primaryKey}
                stroke={primaryColor}
                strokeWidth={2}
                fill={`url(#gradient-${primaryKey})`}
                name={primaryLabel}
              />
              <Area
                type="monotone"
                dataKey={secondaryKey}
                stroke={secondaryColor}
                strokeWidth={2}
                fill={`url(#gradient-${secondaryKey})`}
                name={secondaryLabel}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartLegend}>
          <div className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: primaryColor }}
            />
            <Text variant="caption-1" color="neutral-faded">
              {primaryLabel}
            </Text>
          </div>
          <div className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: secondaryColor }}
            />
            <Text variant="caption-1" color="neutral-faded">
              {secondaryLabel}
            </Text>
          </div>
        </div>
      </View>
    </Card>
  );
};
