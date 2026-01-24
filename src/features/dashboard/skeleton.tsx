import { View, Grid, Skeleton } from 'reshaped';

export const DashboardSkeleton = () => {
  return (
    <View gap={6}>
      <View gap={2} maxWidth={'480px'}>
        <Skeleton height="40px" width={'240px'} />
        <Skeleton height="24px" />
      </View>

      <View direction="row" gap={4} justify="space-between">
        <View direction="row" gap={4}>
          <Skeleton height="40px" width={'240px'} />
          <Skeleton height="40px" width={'240px'} />
        </View>

        <Skeleton height="40px" width={'240px'} />
      </View>

      <Grid columnGap={4} rowGap={4} columns={{ s: 1, m: 2, xl: 4 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} height="140px" />
        ))}
      </Grid>

      <Grid columnGap={4} rowGap={4} columns={{ s: 1, l: 2 }}>
        <Skeleton height="400px" />
        <Skeleton height="400px" />
      </Grid>
    </View>
  );
};
