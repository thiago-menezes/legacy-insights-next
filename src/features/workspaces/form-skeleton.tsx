import { View, Skeleton } from 'reshaped';

export const WorkspaceFormSkeleton = () => {
  return (
    <View
      width="100%"
      height="100%"
      align="center"
      justify="center"
      gap={4}
      paddingTop={4}
    >
      <Skeleton width="80px" height="80px" />
      <Skeleton width="160px" height="16px" />
      <Skeleton width="100%" height="60px" />
      <Skeleton width="100%" height="60px" />
      <View direction="row" width="100%" height="100%" justify="end" gap={4}>
        <Skeleton width="145px" height="34px" />
        <Skeleton width="145px" height="34px" />
      </View>
    </View>
  );
};
