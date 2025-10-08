"use client";

import { useQueries } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import SimplePkmnCard, {
  type SimplePokemon,
} from "@/components/app/SimplePkmnCard";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import { getPokemonById } from "@/lib/pokemonService";

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites } = useFavorites();

  // Fetch all favorite Pokemon data
  const pokemonQueries = useQueries({
    queries: favorites.map((id) => ({
      queryKey: ["pokemonById", id],
      queryFn: () => getPokemonById(id),
      staleTime: Infinity,
      gcTime: Infinity,
    })),
  });

  // Check if any queries are still loading
  const isLoading = pokemonQueries.some((query) => query.isLoading);

  // Transform the query results into SimplePokemon format
  const favoritePokemon: SimplePokemon[] = pokemonQueries
    .map((query) => {
      if (!query.data) return null;

      const pokemon = query.data;
      return {
        id: pokemon.id,
        name: pokemon.name,
        spriteUrl: pokemon.spriteUrl,
        types: pokemon.types,
      } as SimplePokemon;
    })
    .filter((pokemon): pokemon is SimplePokemon => pokemon !== null);

  const handleViewDetails = (id: number) => {
    router.push(`/app/pokemon/${id}`);
  };

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground mt-2">
            Your favorite Pokémon collection
          </p>
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyContent>
              <Heart className="h-12 w-12 text-muted-foreground" />
            </EmptyContent>
            <EmptyTitle>No favorites yet</EmptyTitle>
            <EmptyDescription>
              Start adding Pokémon to your favorites by clicking the heart icon
              on any Pokémon card.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <p className="text-muted-foreground mt-2">
          {isLoading
            ? `Loading ${favorites.length} Pokémon...`
            : `${favoritePokemon.length} Pokémon in your collection`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {pokemonQueries.map((query, index) => {
          // Show skeleton while loading
          if (query.isLoading) {
            return <FavoritePokemonSkeleton key={favorites[index]} />;
          }

          // Skip if error or no data
          if (query.error || !query.data) {
            return null;
          }

          // Show the actual card
          const pokemon = query.data;
          return (
            <SimplePkmnCard
              key={pokemon.id}
              pokemon={{
                id: pokemon.id,
                name: pokemon.name,
                spriteUrl: pokemon.spriteUrl,
                types: pokemon.types,
              }}
              onViewDetails={handleViewDetails}
            />
          );
        })}
      </div>
    </div>
  );
}

// Skeleton component for loading favorite Pokemon
function FavoritePokemonSkeleton() {
  return (
    <div className="group hover:shadow-lg transition-shadow duration-200">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-12" /> {/* Pokemon ID */}
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Dropdown menu */}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 pt-0">
          <div className="flex flex-col items-center space-y-4">
            {/* Pokemon Image */}
            <Skeleton className="h-24 w-24 rounded-lg" />

            {/* Pokemon Name */}
            <Skeleton className="h-6 w-20" />

            {/* Pokemon Types */}
            <div className="flex gap-1">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>

            {/* View Details Button */}
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
