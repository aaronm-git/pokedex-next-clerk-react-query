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

const COLORS = [
  "#60a5fa",
  "#f87171",
  "#34d399",
  "#fbbf24",
  "#a78bfa",
  "#fb7185",
  "#4ade80",
  "#f59e0b",
];

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
      { label: d.name, color: COLORS[i % COLORS.length] },
    ]),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Type Distribution (sample)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64">
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
                  fill={COLORS[(entry.count ?? 0) % COLORS.length]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
          </RePieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
