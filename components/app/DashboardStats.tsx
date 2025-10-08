"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPokemonAggregates } from "@/lib/pokemonService";

export default function DashboardStats() {
  const { data } = useQuery({
    queryKey: ["dashboard", "aggregates"],
    queryFn: getPokemonAggregates,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Pokédex Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Pokémon</p>
          <p className="text-2xl font-bold">{data?.total ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Avg. Base EXP</p>
          <p className="text-2xl font-bold">
            {Math.round(data?.avgBaseExperience ?? 0)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
