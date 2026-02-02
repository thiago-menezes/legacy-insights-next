import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { productsService } from '@/libs/api/services/products';
import { ProductListParams } from '@/libs/api/services/products/types';

export const useProductsQuery = (params?: ProductListParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.list(params),
    placeholderData: keepPreviousData,
  });
};

export const useProductQuery = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  });
};

export const useProductEventsQuery = (id: string) => {
  return useQuery({
    queryKey: ['products', id, 'events'],
    queryFn: () => productsService.getEvents(id),
    enabled: !!id,
  });
};
