"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import PageHeader from "@/components/app/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { execute } from "@/lib/pokemonClient";
import { GET_POKEMON_SPRITES, SEARCH_POKEMON } from "@/lib/queries";
import {
  GetPokemonSpritesByIdsQuery,
  type SearchPokemonQuery,
} from "@/src/graphql/graphql";

export default function PokemonSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  // Search for Pokémon by name pattern
  const {
    data: searchResults,
    isLoading: isSearchingResults,
    isFetched: isFetchedResults,
  } = useQuery({
    queryKey: ["searchPokemon", searchTerm],
    queryFn: () => execute(SEARCH_POKEMON, { searchTerm: `%${searchTerm}%` }),
    gcTime: 1000 * 60 * 10,
    staleTime: Infinity,
    enabled: searchTerm.length > 2 && debouncedSearchTerm === searchTerm,
  });

  const { data: pokemonSprites, isLoading: isLoadingSprites } = useQuery({
    queryKey: [
      "pokemonSprites",
      searchResults?.data?.pokemonspecies.map((pokemon) => pokemon.id),
    ],
    queryFn: () =>
      execute(GET_POKEMON_SPRITES, {
        ids: searchResults?.data?.pokemonspecies.map((pokemon) => pokemon.id),
      }),
    enabled:
      !!searchResults?.data?.pokemonspecies.length &&
      searchResults?.data?.pokemonspecies.length > 0,
    staleTime: Infinity,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query above
  };

  useEffect(() => {
    if (!isFetchedResults && searchTerm.length > 2) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, isFetchedResults]);

  return (
    <div className="space-y-6">
      <PageHeader title="Pokémon Search" IconComponent={Search} />

      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </form>

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isSearching ? (
          <LoadingSearchResults />
        ) : (
          <PokemonSearchResults
            searchTerm={searchTerm}
            pokemon={searchResults?.data?.pokemonspecies ?? []}
            pokemonSprites={pokemonSprites?.data?.pokemonformsprites ?? []}
            isLoadingSprites={isLoadingSprites}
            isFetchedResults={isFetchedResults}
          />
        )}
      </div>
    </div>
  );
}

function LoadingSearchResults() {
  return new Array(12)
    .fill(0)
    .map((_, index) => (
      <Skeleton key={index.toString()} className="w-full h-40" />
    ));
}

function PokemonSearchResults({
  searchTerm,
  pokemon,
  pokemonSprites,
  isLoadingSprites,
  isFetchedResults,
}: {
  searchTerm: string;
  pokemon: SearchPokemonQuery["pokemonspecies"];
  pokemonSprites: GetPokemonSpritesByIdsQuery["pokemonformsprites"];
  isLoadingSprites: boolean;
  isFetchedResults: boolean;
}) {
  if (!isFetchedResults && searchTerm.length > 2) {
    return <div className="text-center text-2xl">No results found</div>;
  }

  return pokemon.map((pkmn) => (
    <Card key={pkmn.id}>
      <CardHeader>
        {isLoadingSprites ? (
          <Skeleton className="w-[96px] h-[96px]" />
        ) : (
          <Image
            src={
              pokemonSprites.find(
                (sprite) => sprite.pokemon_form_id === pkmn.id,
              )?.sprites.front_default
            }
            alt={`${pkmn.name} sprite`}
            width={96}
            height={96}
          />
        )}
        <CardTitle className="capitalize">
          #{pkmn.id} {pkmn.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{pkmn.generation?.name}</p>
      </CardContent>
    </Card>
  ));
}
