"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { CgPokemon } from "react-icons/cg";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import PageHeader from "@/components/app/PageHeader";
import { PokemonStatsRadarChart } from "@/components/app/pokemon-stats-radar-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { execute } from "@/lib/pokemonClient";
import { POKEMON_ID_PAGE_QUERY } from "@/lib/queries";

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const idNum = parseInt(id, 10);

  // Only use notFound() for completely invalid URLs (non-numeric IDs)
  if (Number.isNaN(idNum)) notFound();

  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemonById", idNum],
    queryFn: () => execute(POKEMON_ID_PAGE_QUERY, { id: idNum }),
    enabled: Number.isFinite(idNum),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  console.log(data);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-8 w-32" />
            </CardHeader>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data?.data?.pokemon?.[0]) {
    return (
      <div className="space-y-6">
        <PageHeader title="Pokemon Not Found" IconComponent={CgPokemon} />

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-muted p-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Pokemon #{id} Not Found</CardTitle>
            <CardDescription className="text-base">
              {error
                ? "There was an error loading this Pokemon. Please try again."
                : "The Pokemon you're looking for doesn't exist in our database."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Try searching for a Pokemon by name or browse Pokemon #1-1010
              </p>
              {idNum > 1010 && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Pokemon #{id} is beyond the current database range
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/app/pokemon-search">
                  <Search className="w-4 h-4 mr-2" />
                  Search Pokemon
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/app/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Or try a random Pokemon:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[1, 25, 150, 249, 493, 649, 721, 809, 898, 1010].map(
                  (randomId) => (
                    <Button key={randomId} variant="ghost" size="sm" asChild>
                      <Link href={`/app/pokemon/${randomId}`}>#{randomId}</Link>
                    </Button>
                  ),
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pokemon = data.data.pokemon[0];
  return (
    <div className="space-y-6">
      <PageHeader title={pokemon.name} IconComponent={CgPokemon} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Hero Card - Pokemon Image & Basic Info */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-2xl" />
                <Image
                  src={
                    pokemon.pokemonsprites?.[0]?.sprites?.front_default ||
                    "/egg.svg"
                  }
                  alt={pokemon.name}
                  width={200}
                  height={200}
                  className="relative z-10 drop-shadow-2xl"
                />
              </div>
            </div>
            <CardTitle className="text-3xl capitalize">
              {pokemon.name}
            </CardTitle>
            <CardDescription>
              #{idNum.toString().padStart(3, "0")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Cries</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1"
                  asChild
                  onClick={() => {
                    const audio = new Audio(
                      pokemon.pokemoncries[0].cries.latest,
                    );
                    audio.play();
                  }}
                >
                  <HiMiniSpeakerWave />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Types</p>
              <div className="flex flex-wrap gap-2">
                {pokemon.pokemontypes?.map((type) => (
                  <Badge
                    key={type.type?.name}
                    variant="secondary"
                    className="capitalize"
                  >
                    {type.type?.name}
                  </Badge>
                )) || <Badge variant="outline">Unknown</Badge>}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Base Experience
              </p>
              <p className="text-2xl font-bold">
                {pokemon.base_experience || "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Stats Overview</CardTitle>
            <CardDescription>Combat statistics and attributes</CardDescription>
          </CardHeader>
          <CardContent>
            {pokemon.pokemonstats && pokemon.pokemonstats.length > 0 ? (
              <PokemonStatsRadarChart
                stats={pokemon.pokemonstats}
                pokemonName={pokemon.name}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No stats available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Abilities Card */}
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Abilities</CardTitle>
            <CardDescription>Special powers and skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {pokemon.pokemonabilities?.map((ability) => (
                <Badge
                  key={ability.ability?.name}
                  variant="outline"
                  className="capitalize"
                >
                  {ability.ability?.name?.replace(/-/g, " ")}
                </Badge>
              )) || (
                <p className="text-sm text-muted-foreground">
                  No abilities available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Moves Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Moves</CardTitle>
            <CardDescription>
              {pokemon.pokemonmoves?.length
                ? `${pokemon.pokemonmoves.length} available moves`
                : "No moves available"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pokemon.pokemonmoves && pokemon.pokemonmoves.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {pokemon.pokemonmoves.map((move, index) => (
                    <div
                      key={`${move.move?.name}-${index}`}
                      className="group relative rounded-lg border p-3 hover:bg-accent hover:shadow-sm transition-all"
                    >
                      <p className="text-sm font-medium capitalize leading-tight">
                        {move.move?.name?.replace(/-/g, " ")}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">
                No moves available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
