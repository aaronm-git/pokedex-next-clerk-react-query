"use client";

import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTopPokemonByBaseExperience } from "@/lib/pokemonService";

export default function DashboardTopPokemon() {
  const { data } = useQuery({
    queryKey: ["dashboard", "topBaseExp"],
    queryFn: () => getTopPokemonByBaseExperience(5),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top Base Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {data?.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <Image
              src={p.spriteUrl || "/egg.svg"}
              alt={p.name}
              width={40}
              height={40}
            />
            <div className="flex-1">
              <div className="font-medium capitalize">{p.name}</div>
              <div className="flex gap-1 mt-1">
                {p.types.map((t) => (
                  <Badge key={t.name} variant="secondary" className="text-xs">
                    {t.awesomeName}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              EXP {p.baseExperience}
            </div>
          </div>
        )) || <div className="text-sm text-muted-foreground">No data</div>}
      </CardContent>
    </Card>
  );
}
