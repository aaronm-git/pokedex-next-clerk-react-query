"use client";

import { useQuery } from "@tanstack/react-query";
import { PieChart } from "lucide-react";
import { Cell, Pie, PieChart as RePieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { POKEMON_TYPE_COLORS } from "@/lib/constants";
import { getTypeDistribution } from "@/lib/pokemonService";

export default function DashboardTypeDistribution() {
  const { data } = useQuery({
    queryKey: ["dashboard", "typeDistribution"],
    queryFn: () => getTypeDistribution(150),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const config = Object.fromEntries(
    (data || []).map((d) => [
      d.name.toLowerCase(),
      {
        label: d.name,
        color:
          POKEMON_TYPE_COLORS[
            d.name.toLowerCase() as keyof typeof POKEMON_TYPE_COLORS
          ],
      },
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
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <ChartContainer config={config} className="h-64 flex-1">
            <RePieChart>
              <Pie
                data={data || []}
                dataKey="count"
                nameKey="name"
                outerRadius={80}
              >
                {(data || []).map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={`var(--color-${entry.name.toLowerCase()})`}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            </RePieChart>
          </ChartContainer>

          {/* Custom Responsive Legend */}
          <div className="flex flex-row flex-wrap lg:flex-col gap-2 lg:min-w-[100px]">
            {(data || []).map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{
                    backgroundColor:
                      POKEMON_TYPE_COLORS[
                        entry.name.toLowerCase() as keyof typeof POKEMON_TYPE_COLORS
                      ],
                  }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Distribution of Pokémon types in the database.
        </p>
      </CardContent>
    </Card>
  );
}
