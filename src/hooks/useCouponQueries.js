import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { queryKeys } from '../constants/queryKeys';

// Fetch active coupons
export const useActiveCoupons = () => {
  return useQuery({
    queryKey: queryKeys.coupons.active(),
    queryFn: async () => {
      const res = await api.get('/customer/coupons/active');
      return res?.coupons || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Validate coupon code mutation
export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async ({ code, cartTotal }) => {
      return await api.post('/customer/coupons/validate', { code, cartTotal });
    },
  });
};

