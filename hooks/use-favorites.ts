import { useUser } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useFavorites = () => {
  const user = useUser();
  const queryClient = useQueryClient();
  const FAVORITES_KEY = ["myPokemon", user?.user?.id];
  const { data: favorites = [] } = useQuery<number[]>({
    queryKey: FAVORITES_KEY,
    queryFn: async () => [],
    placeholderData: [],
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
    const favorites = queryClient.getQueryData<number[]>(FAVORITES_KEY);
    if (favorites?.includes(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const isFavorite = (id: number): boolean => favorites?.includes(id) ?? false;

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
};
