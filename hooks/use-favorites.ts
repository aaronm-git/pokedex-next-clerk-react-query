import { useQuery, useQueryClient } from "@tanstack/react-query";
// Custom hooks for Pokemon save/delete functionality
export const useFavorites = () => {
  const queryClient = useQueryClient();
  const FAVORITES_KEY = ["myPokemon"];
  // Read favorites (persisted via react-query-persist-client)
  const { data: favorites = [] } = useQuery<number[]>({
    queryKey: FAVORITES_KEY,
    // no fetcher; we're only using the cache (and persistence rehydration)
    queryFn: async () => [],
    placeholderData: [], // Use placeholderData instead of initialData to allow persistence to work
    // optional: never consider this "stale" since it's client-only
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const addFavorite = (id: number) => {
    queryClient.setQueryData<number[]>(FAVORITES_KEY, (prev = []) =>
      prev.includes(id) ? prev : [...prev, id],
    );
  };

  const removeFavorite = (id: number) => {
    queryClient.setQueryData<number[]>(FAVORITES_KEY, (prev = []) =>
      prev.filter((x) => x !== id),
    );
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const isFavorite = (id: number): boolean => favorites.includes(id);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};
