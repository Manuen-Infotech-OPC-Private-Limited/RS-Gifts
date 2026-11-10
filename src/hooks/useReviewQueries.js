import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { queryKeys } from '../constants/queryKeys';

// Fetch approved reviews for a product
export const useProductReviews = (productId) => {
  return useQuery({
    queryKey: queryKeys.reviews.byProduct(productId),
    queryFn: async () => {
      if (!productId) return [];
      const res = await api.get(`/customer/reviews/product/${productId}`);
      return res?.reviews || [];
    },
    enabled: Boolean(productId),
    staleTime: 1000 * 60 * 2,
  });
};

// Submit a new review mutation with automatic cache invalidation
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, rating, comment, customerName }) => {
      return await api.post('/customer/reviews', {
        productId,
        rating,
        comment,
        customerName,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byProduct(variables.productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.productId) });
    },
  });
};
