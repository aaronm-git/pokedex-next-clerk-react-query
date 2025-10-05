"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import { CgPokemon } from "react-icons/cg";
import PageHeader from "@/components/app/PageHeader";
import { PokemonStatsRadarChart } from "@/components/pokemon/pokemon-stats-radar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  if (Number.isNaN(idNum)) notFound();

  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemonById", idNum],
    queryFn: () => execute(POKEMON_ID_PAGE_QUERY, { id: idNum }),
    enabled: Number.isFinite(idNum),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-32 w-32" />
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-24" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) notFound();

  const pokemon = data?.data?.pokemon?.[0];
  if (!pokemon) notFound();

  return (
    <div className="space-y-6">
      <PageHeader title={pokemon.name} IconComponent={CgPokemon} />
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{pokemon.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src={
                  pokemon.pokemonsprites?.[0]?.sprites?.front_default ||
                  "/egg.svg"
                }
                alt={pokemon.name}
                width={100}
                height={100}
                className="rounded-lg"
              />
              <div className="space-y-2">
                <p>
                  <strong>Base Experience:</strong> {pokemon.base_experience}
                </p>
                <p>
                  <strong>Types:</strong>{" "}
                  {pokemon.pokemontypes
                    ?.map((type) => type.type?.name)
                    .join(", ") || "Unknown"}
                </p>
                <p>
                  <strong>Abilities:</strong>{" "}
                  {pokemon.pokemonabilities
                    ?.map((ability) => ability.ability?.name)
                    .join(", ") || "Unknown"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Stats Radar Chart */}
              <div>
                <h3 className="font-semibold mb-4">Stats</h3>
                {pokemon.pokemonstats && pokemon.pokemonstats.length > 0 ? (
                  <PokemonStatsRadarChart
                    stats={pokemon.pokemonstats}
                    pokemonName={pokemon.name}
                  />
                ) : (
                  <p className="text-muted-foreground">No stats available</p>
                )}
              </div>

              {/* Moves */}
              <div>
                <h3 className="font-semibold mb-2">Moves</h3>
                <div className="max-h-32 overflow-y-auto">
                  <div className="space-y-1">
                    {pokemon.pokemonmoves?.slice(0, 10).map((move) => (
                      <div key={move.move?.name} className="text-sm capitalize">
                        {move.move?.name}
                      </div>
                    ))}
                    {pokemon.pokemonmoves &&
                      pokemon.pokemonmoves.length > 10 && (
                        <div className="text-sm text-gray-500">
                          +{pokemon.pokemonmoves.length - 10} more moves
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
