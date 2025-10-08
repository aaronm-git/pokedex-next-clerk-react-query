import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 24 hours - this is important for persistence to work properly
      gcTime: 1000 * 60 * 60 * 24,
      // 5 minutes - consider data stale after this time
      staleTime: 1000 * 60 * 5,
      // Retry failed queries 1 time
      retry: 1,
      // Don't refetch on window focus by default for better UX with persistence
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
