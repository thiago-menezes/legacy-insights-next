import { useState, useMemo } from 'react';
import { useCampaignsQuery } from './api/query';
import { CampaignsFilters } from './types';
import { mapStrapiToCampaignsData } from './utils';

export const useCampaignsData = () => {
  const [filters, setFilters] = useState<CampaignsFilters>({
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading, error, refetch } = useCampaignsQuery({
    platform: 'meta',
    startDate: filters?.startDate?.toISOString(),
    endDate: filters?.endDate?.toISOString(),
    page: filters?.page,
    pageSize: filters?.pageSize,
  });

  const mappedData = useMemo(() => {
    if (!data) return null;
    return mapStrapiToCampaignsData(data);
  }, [data]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  };

  return {
    data: mappedData,
    isLoading,
    error,
    refetch,
    filters,
    handlePageChange,
    handlePageSizeChange,
  };
};
