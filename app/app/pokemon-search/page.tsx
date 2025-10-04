"use client";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import PageHeader from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { execute } from "@/lib/pokemonClient";
import { GET_POKEMON_SPRITES, SEARCH_POKEMON } from "@/lib/queries";
import type {
  GetPokemonSpritesByIdsQuery,
  SearchPokemonQuery,
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
    queryKey: ["pokemonSearch", debouncedSearchTerm],
    queryFn: () =>
      execute(SEARCH_POKEMON, { searchTerm: `%${debouncedSearchTerm}%` }),
    gcTime: 1000 * 60 * 10,
    staleTime: Infinity,
    enabled:
      debouncedSearchTerm.length > 2 && debouncedSearchTerm === searchTerm,
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
            noResults={
              searchTerm.length > 2 &&
              searchResults?.data?.pokemonspecies.length === 0
            }
            pokemon={searchResults?.data?.pokemonspecies ?? []}
            pokemonSprites={pokemonSprites?.data?.pokemonformsprites ?? []}
            isLoadingSprites={isLoadingSprites}
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
  noResults,
  pokemon,
  pokemonSprites,
  isLoadingSprites,
}: {
  noResults: boolean;
  pokemon: SearchPokemonQuery["pokemonspecies"];
  pokemonSprites: GetPokemonSpritesByIdsQuery["pokemonformsprites"];
  isLoadingSprites: boolean;
}) {
  if (noResults) {
    return (
      <div className="text-center font-semibold text-2xl col-span-full row-span-full flex flex-col items-center gap-4 justify-center py-20">
        <Image src="/egg.svg" alt="No results found" width={96} height={96} />
        No Pokémon found...
      </div>
    );
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
        <p className="uppercase">{pkmn.generation?.name}</p>
      </CardContent>
    </Card>
  ));
}
