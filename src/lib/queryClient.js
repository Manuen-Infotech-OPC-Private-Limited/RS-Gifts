import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh data caching
      gcTime: 1000 * 60 * 15, // 15 minutes garbage collection
      refetchOnWindowFocus: false, // Avoid flickering on browser tab switch
      retry: (failureCount, error) => {
        // Do not retry on client auth errors or missing resources
        const status = error?.response?.status;
        if (status === 401 || status === 403 || status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

export default queryClient;
