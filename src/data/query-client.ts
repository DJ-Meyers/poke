import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // PokeAPI data is static — never refetch automatically
      staleTime: Infinity,
      // Keep unused data in cache for 30 minutes
      gcTime: 1000 * 60 * 30,
    },
  },
});
