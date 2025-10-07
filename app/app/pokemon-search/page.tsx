"use client";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getSearchPokemon } from "@/lib/pokemonService";

export default function PokemonSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  // Search for Pokémon by name pattern
  const { data: searchResults, isFetched: isFetchedResults } = useQuery({
    queryKey: ["pokemonSearch", debouncedSearchTerm],
    queryFn: () => getSearchPokemon(debouncedSearchTerm, 0),
    gcTime: 1000 * 60 * 10,
    staleTime: Infinity,
    enabled:
      debouncedSearchTerm.length > 2 && debouncedSearchTerm === searchTerm,
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
          autoFocus
          onFocus={(e) => {
            (e.target as HTMLInputElement).select();
          }}
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
              searchTerm.length > 2 && searchResults?.pokemon.length === 0
            }
            pokemon={searchResults?.pokemon ?? []}
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
}: {
  noResults: boolean;
  pokemon: {
    id: number;
    name: string;
    spriteUrl: string;
    type: string;
  }[];
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
    <Link href={`/app/pokemon/${pkmn.id}`} key={pkmn.id} className="group">
      <Card className="group-hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <Image
            src={pkmn.spriteUrl || "/egg.svg"}
            alt={`${pkmn.name} sprite`}
            width={96}
            height={96}
            className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-105"
          />
          <CardTitle className="capitalize">
            #{pkmn.id} {pkmn.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{pkmn.type}</p>
        </CardContent>
      </Card>
    </Link>
  ));
}
