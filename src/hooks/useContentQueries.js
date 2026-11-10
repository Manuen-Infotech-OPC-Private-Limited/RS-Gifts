import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { queryKeys } from '../constants/queryKeys';

// Fetch Public Website Settings (Cached globally across Navbar, Footer, Cart, Contact)
export const useSettings = () => {
  return useQuery({
    queryKey: queryKeys.content.settings(),
    queryFn: async () => {
      const res = await api.get('/customer/content/settings');
      return res?.settings || res || {};
    },
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};

// Fetch Active Marketing Hero Banners
export const useBanners = () => {
  return useQuery({
    queryKey: queryKeys.content.banners(),
    queryFn: async () => {
      const res = await api.get('/customer/content/banners');
      return res?.banners || (Array.isArray(res) ? res : []);
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch Active Gift Categories
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.content.categories(),
    queryFn: async () => {
      try {
        const res = await api.get('/customer/content/categories');
        return res?.categories || (Array.isArray(res) ? res : []);
      } catch {
        const fallback = await api.get('/categories');
        return fallback?.categories || (Array.isArray(fallback) ? fallback : []);
      }
    },
    staleTime: 1000 * 60 * 10,
  });
};

// Fetch Active Occasions
export const useOccasions = () => {
  return useQuery({
    queryKey: queryKeys.content.occasions(),
    queryFn: async () => {
      const res = await api.get('/customer/content/occasions');
      return res?.occasions || (Array.isArray(res) ? res : []);
    },
    staleTime: 1000 * 60 * 10,
  });
};

