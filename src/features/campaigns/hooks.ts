import { useCallback, useMemo, useState } from 'react';
import { useCampaignsQuery } from './api/query';
import { CampaignsFilters } from './types';
import { mapStrapiToCampaignsData } from './utils';

export const useCampaignsData = (
  platform: 'meta' | 'google' = 'meta',
  integrationId?: string | number,
) => {
  const [filters, setFilters] = useState<CampaignsFilters>({
    page: 1,
    pageSize: 10,
    integrationId,
    sortBy: 'name',
  });

  const { data, isLoading, error, refetch } = useCampaignsQuery({
    platform,
    integrationId: filters?.integrationId,
    startDate: filters?.startDate?.toISOString(),
    endDate: filters?.endDate?.toISOString(),
    search: filters?.search,
    sortBy: filters?.sortBy,
    sortOrder: filters?.sortOrder,
    showOnlyActive: filters?.showOnlyActive,
    status: filters?.status,
    page: filters?.page,
    pageSize: filters?.pageSize,
  });

  const mappedData = useMemo(() => {
    if (!data) return null;
    return mapStrapiToCampaignsData(data);
  }, [data]);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handleDateRangeChange = useCallback((days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    setFilters((prev) => ({
      ...prev,
      startDate,
      endDate,
      page: 1,
    }));
  }, []);

  const handleStartDateChange = useCallback((date: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      startDate: date || undefined,
      page: 1,
    }));
  }, []);

  const handleEndDateChange = useCallback((date: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      endDate: date || undefined,
      page: 1,
    }));
  }, []);

  const handleShowOnlyActiveChange = useCallback((value: boolean) => {
    setFilters((prev) => ({
      ...prev,
      showOnlyActive: value,
      page: 1,
    }));
  }, []);

  const handleStatusChange = useCallback(
    (status: CampaignsFilters['status']) => {
      setFilters((prev) => ({
        ...prev,
        status,
        page: 1,
      }));
    },
    [],
  );

  const handleAdvancedFiltersChange = useCallback(
    (advancedFilters: Pick<CampaignsFilters, 'status' | 'showOnlyActive'>) => {
      setFilters((prev) => ({
        ...prev,
        ...advancedFilters,
        page: 1,
      }));
    },
    [],
  );

  const handleRemoveFilter = useCallback(
    (key: keyof CampaignsFilters, value?: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev };

        if (key === 'status' && value) {
          // Remove specific status from array
          newFilters.status = prev.status?.filter((s) => s !== value);
          if (newFilters.status?.length === 0) {
            delete newFilters.status;
          }
        } else if (key === 'startDate' || key === 'endDate') {
          // Remove both date filters
          delete newFilters.startDate;
          delete newFilters.endDate;
        } else {
          // Remove single filter
          delete newFilters[key];
        }

        return { ...newFilters, page: 1 };
      });
    },
    [],
  );

  const handleClearAllFilters = useCallback(() => {
    setFilters((prev) => ({
      page: 1,
      pageSize: prev.pageSize,
      integrationId: prev.integrationId,
      sortBy: prev.sortBy,
      sortOrder: prev.sortOrder,
    }));
  }, []);

  return {
    data: mappedData,
    isLoading,
    error,
    refetch,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleDateRangeChange,
    handleStartDateChange,
    handleEndDateChange,
    handleShowOnlyActiveChange,
    handleStatusChange,
    handleAdvancedFiltersChange,
    handleRemoveFilter,
    handleClearAllFilters,
  };
};
