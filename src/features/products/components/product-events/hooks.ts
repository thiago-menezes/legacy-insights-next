import { useProductEventsQuery } from '../../api/query';

export const useProductEvents = (productId: string) => {
  const { data, isLoading, error, refetch } = useProductEventsQuery(productId);

  const events = data?.data || [];

  return {
    events,
    isLoading,
    error,
    refetch,
  };
};
