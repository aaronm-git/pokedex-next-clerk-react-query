"use client";

import { useQuery } from "@tanstack/react-query";
import { PieChart } from "lucide-react";
import { Cell, Pie, PieChart as RePieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getTypeDistribution } from "@/lib/pokemonService";

const COLORS = {
  grass: "#60a5fa",
  fire: "#e30000",
  water: "#34d399",
  electric: "#fbbf24",
  psychic: "#a78bfa",
  ice: "#fb7185",
  dark: "#323232",
  dragon: "#9333ea",
  fairy: "#f472b6",
  fighting: "#ef4444",
  flying: "#8b5cf6",
  ghost: "#701a75",
  normal: "#a855f7",
  poison: "#e11d48",
  rock: "#e2e8f0",
  steel: "#94a3b8",
  unknown: "#323232",
  shadow: "#701a75",
};

export default function DashboardTypeDistribution() {
  const { data } = useQuery({
    queryKey: ["dashboard", "typeDistribution"],
    queryFn: () => getTypeDistribution(150),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const config = Object.fromEntries(
    (data || []).map((d, i) => [
      d.name,
      { label: d.name, color: COLORS[d.name as keyof typeof COLORS] },
    ]),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Type Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <RePieChart>
            <Pie
              data={data || []}
              dataKey="count"
              nameKey="name"
              outerRadius={100}
            >
              {(data || []).map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              align="center"
            />
          </RePieChart>
        </ChartContainer>
        <p className="text-sm text-muted-foreground">
          Distribution of Pokémon types in the database.
        </p>
      </CardContent>
    </Card>
  );
}
