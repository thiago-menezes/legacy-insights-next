import { useCallback, useState } from 'react';
import { useProductsQuery } from './api/query';
import { ProductFilters } from './types';

export const useProductsData = (projectId?: string) => {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: 10,
    projectId,
  });

  const { data, isLoading, error, refetch } = useProductsQuery(filters);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handlePlatformChange = useCallback(
    (platform: ProductFilters['platform']) => {
      setFilters((prev) => ({ ...prev, platform, page: 1 }));
    },
    [],
  );

  const handleActiveChange = useCallback((active: boolean | undefined) => {
    setFilters((prev) => ({ ...prev, active, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      page: 1,
      pageSize: 10,
      projectId,
    });
  }, [projectId]);

  return {
    data,
    isLoading,
    error,
    refetch,
    filters,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handlePlatformChange,
    handleActiveChange,
    handleClearFilters,
  };
};
