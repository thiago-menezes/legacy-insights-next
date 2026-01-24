import { View, Skeleton } from 'reshaped';
import styles from './styles.module.scss';

export const CampaignsSkeleton = () => {
  return (
    <View gap={6} className={styles.campaigns}>
      {/* Header */}
      <View gap={2}>
        <Skeleton height="32px" width="280px" />
        <Skeleton height="20px" width="480px" />
      </View>

      {/* Tabs and actions */}
      <View direction="row" justify="space-between" align="center">
        <Skeleton height="40px" width="280px" />
        <Skeleton height="40px" width="140px" />
      </View>

      {/* Metrics */}
      <div className={styles.metricsGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height="120px" />
        ))}
      </div>

      {/* Filter bar */}
      <View direction="row" justify="space-between" align="center">
        <View direction="row" gap={3}>
          <Skeleton height="40px" width="220px" />
          <Skeleton height="40px" width="100px" />
        </View>
        <Skeleton height="40px" width="140px" />
      </View>

      {/* Table */}
      <Skeleton height="500px" />
    </View>
  );
};
