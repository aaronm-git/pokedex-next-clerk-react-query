"use client";

import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

interface PokemonStat {
  base_stat: number;
  stat?: {
    name: string;
    [key: string]: unknown; // Allow additional properties from GraphQL
  } | null;
}

interface PokemonStatsRadarChartProps {
  stats: PokemonStat[];
  pokemonName: string;
}

export function PokemonStatsRadarChart({
  stats,
  pokemonName,
}: PokemonStatsRadarChartProps) {
  // Map stat names to more readable labels
  const statNameMap: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed",
  };

  const labels = stats.map(
    (stat) =>
      statNameMap[stat.stat?.name || ""] || stat.stat?.name || "Unknown",
  );

  const values = stats.map((stat) => stat.base_stat);

  const data = {
    labels,
    datasets: [
      {
        label: `${pokemonName} Stats`,
        data: values,
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.2)", // Blue with transparency
        borderColor: "rgb(59, 130, 246)", // Blue
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(59, 130, 246)",
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend since we only have one dataset
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"radar">) => {
            return `${context.label}: ${context.parsed.r}`;
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        pointLabels: {
          font: {
            size: 12,
            weight: 500,
          },
          color: "hsl(var(--foreground))",
        },
        ticks: {
          display: false, // Hide the tick labels (numbers on the radial lines)
        },
        suggestedMin: 0,
        suggestedMax: Math.max(...values) + 20, // Add some padding above max value
      },
    },
  };

  return (
    <div className="w-full h-64 md:h-80">
      <Radar data={data} options={options} />
    </div>
  );
}
