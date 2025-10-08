"use client";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import PageHeader from "@/components/app/PageHeader";
import SimplePkmnCard, {
  type SimplePokemon,
} from "@/components/app/SimplePkmnCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getSearchPokemon } from "@/lib/pokemonService";

function PokemonSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search term from URL parameter
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get("q") || "";
  });
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

  // Update URL when search term changes and meets criteria
  useEffect(() => {
    const updateURL = () => {
      const params = new URLSearchParams();

      if (
        debouncedSearchTerm.length > 2 &&
        debouncedSearchTerm === searchTerm
      ) {
        params.set("q", debouncedSearchTerm);
        // Use replace to update URL without adding to history for each search
        router.replace(`/app/pokemon-search?${params.toString()}`);
      } else if (debouncedSearchTerm.length === 0) {
        // Clear the URL parameter when search is empty
        router.replace("/app/pokemon-search");
      }
    };

    updateURL();
  }, [debouncedSearchTerm, searchTerm, router]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isSearching ? (
          <LoadingSearchResults />
        ) : (
          <PokemonSearchResults
            noResults={
              searchTerm.length > 2 && searchResults?.pokemon.length === 0
            }
            pokemon={searchResults?.pokemon ?? []}
            onViewDetails={(id) => router.push(`/app/pokemon/${id}`)}
          />
        )}
      </div>
    </div>
  );
}

function LoadingSearchResults() {
  return new Array(12).fill(0).map((_, index) => (
    <div
      key={index.toString()}
      className="group hover:shadow-lg transition-shadow duration-200"
    >
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
  ));
}

function PokemonSearchResults({
  noResults,
  pokemon,
  onViewDetails,
}: {
  noResults: boolean;
  pokemon: {
    id: number;
    name: string;
    spriteUrl: string;
    type: string;
  }[];
  onViewDetails: (id: number) => void;
}) {
  if (noResults) {
    return (
      <div className="text-center font-semibold text-2xl col-span-full row-span-full flex flex-col items-center gap-4 justify-center py-20">
        <Image src="/egg.svg" alt="No results found" width={96} height={96} />
        No Pokémon found...
      </div>
    );
  }

  // Transform search results to match SimplePokemon interface
  const transformedPokemon: SimplePokemon[] = pokemon.map((pkmn) => ({
    id: pkmn.id,
    name: pkmn.name,
    spriteUrl: pkmn.spriteUrl || "/egg.svg",
    types: [
      {
        name: pkmn.type.toLowerCase(),
        awesomeName: pkmn.type,
      },
    ],
  }));

  return transformedPokemon.map((pkmn) => (
    <SimplePkmnCard
      key={pkmn.id}
      pokemon={pkmn}
      onViewDetails={onViewDetails}
    />
  ));
}

export default function PokemonSearch() {
  return (
    <Suspense fallback={<PokemonSearchFallback />}>
      <PokemonSearchContent />
    </Suspense>
  );
}

function PokemonSearchFallback() {
  return (
    <div className="space-y-6">
      <PageHeader title="Pokémon Search" IconComponent={Search} />
      
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <LoadingSearchResults />
      </div>
    </div>
  );
}
