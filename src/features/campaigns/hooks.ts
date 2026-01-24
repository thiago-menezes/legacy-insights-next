import { useState, useEffect, useCallback } from 'react';
import { fetchCampaignsData } from '@/data/mock';
import { CampaignsData, CampaignsFilters } from './types';

interface UseCampaignsDataResult {
  data: CampaignsData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useCampaignsData = (
  filters?: CampaignsFilters,
): UseCampaignsDataResult => {
  const [data, setData] = useState<CampaignsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchCampaignsData(filters);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to fetch campaigns data'),
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};
