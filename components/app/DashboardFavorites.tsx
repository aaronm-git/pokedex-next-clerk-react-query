"use client";

import { useQueries } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SimplePkmnCard from "@/components/app/SimplePkmnCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/use-favorites";
import { getPokemonById } from "@/lib/pokemonService";

export default function DashboardFavorites() {
  const { favorites } = useFavorites();
  const limitedFavorites = (favorites || []).slice(0, 6);
  const pokemonQueries = useQueries({
    queries: limitedFavorites.map((id) => ({
      queryKey: ["pokemonById", id],
      queryFn: () => getPokemonById(id),
      staleTime: Infinity,
      gcTime: Infinity,
    })),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Your Favorites
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!favorites || favorites.length === 0 ? (
          <div className="text-sm text-muted-foreground flex flex-col items-center justify-center gap-3 py-10">
            <Image src="/egg.svg" alt="No favorites" width={64} height={64} />
            <span>No favorites yet</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pokemonQueries.map((query, idx) => {
              if (query.isLoading)
                return (
                  <FavoriteSkeleton
                    key={limitedFavorites[idx] ?? `fav-skel-${idx}`}
                  />
                );
              if (query.error || !query.data) return null;

              const p = query.data;
              return (
                <SimplePkmnCard
                  key={p.id}
                  pokemon={{
                    id: p.id,
                    name: p.name,
                    spriteUrl: p.spriteUrl,
                    types: p.types,
                  }}
                  onViewDetails={(id) => {
                    window.location.href = `/app/pokemon/${id}`;
                  }}
                />
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href="/app/favorites">View All Favorites</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function FavoriteSkeleton() {
  return (
    <div className="group hover:shadow-lg transition-shadow duration-200">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-lg" />
            <Skeleton className="h-6 w-20" />
            <div className="flex gap-1">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
