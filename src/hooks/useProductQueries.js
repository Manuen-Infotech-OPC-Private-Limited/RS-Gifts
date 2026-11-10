import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../constants/queryKeys';
import {
  getCustomerProducts,
  getProductBySlugOrId,
  getFeaturedProducts,
} from '../services/productService';

// Query list of products with filters & pagination
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => getCustomerProducts(params),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
};

// Query single product details by slug or ID
export const useProduct = (idOrSlug) => {
  return useQuery({
    queryKey: queryKeys.products.detail(idOrSlug),
    queryFn: () => getProductBySlugOrId(idOrSlug),
    enabled: Boolean(idOrSlug),
    staleTime: 1000 * 60 * 5,
  });
};

// Query featured gifts
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: () => getFeaturedProducts(),
    staleTime: 1000 * 60 * 5,
  });
};

