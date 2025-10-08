"use client";

import { useQueryClient } from "@tanstack/react-query";
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
import { useFavorites } from "@/hooks/use-favorites";

export default function FavoritesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { favorites } = useFavorites();

  // Simply read from existing individual Pokemon caches
  const favoritePokemon: SimplePokemon[] = favorites
    .map((id) => {
      const cachedPokemon = queryClient.getQueryData(["pokemonById", id]);
      if (cachedPokemon) {
        const pokemon = cachedPokemon as {
          id: number;
          name: string;
          spriteUrl: string;
          types: Array<{ name: string; awesomeName: string }>;
        };
        return {
          id: pokemon.id,
          name: pokemon.name,
          spriteUrl: pokemon.spriteUrl,
          types: pokemon.types,
          isFavorited: true,
        } as SimplePokemon;
      }
      return null;
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
          {favoritePokemon.length} Pokémon in your collection
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {favoritePokemon.map((pokemon) => (
          <SimplePkmnCard
            key={pokemon.id}
            pokemon={pokemon}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
}
