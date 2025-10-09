"use client";

import { ExternalLink, Heart, MoreVertical } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { PokemonTypeTag } from "@/components/app/pokemon-type-tag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFavorites } from "@/hooks/use-favorites";

// Custom type with only the data needed for the card
export interface SimplePokemon {
  id: number;
  name: string;
  spriteUrl: string;
  types: Array<{
    name: string;
    awesomeName: string;
  }>;
}

interface SimplePkmnCardProps {
  pokemon: SimplePokemon;
  onViewDetails?: (id: number) => void;
}

export default function SimplePkmnCard({
  pokemon,
  onViewDetails,
}: SimplePkmnCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const handleFavorite = () => {
    try {
      if (isFavorite(pokemon.id)) {
        removeFavorite(pokemon.id);
        toast.success("Pokémon removed from favorites");
      } else {
        addFavorite(pokemon.id);
        toast.success("Pokémon added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      toast.error("Failed to update Pokémon favorite status");
    }
  };

  const isFavorited = isFavorite(pokemon.id);

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              #{pokemon.id.toString().padStart(3, "0")}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleFavorite}>
                <Heart
                  className={`h-4 w-4 mr-2 ${isFavorited ? "fill-current text-red-500" : ""}`}
                />
                {isFavorited ? "Remove from Favorites" : "Add to Favorites"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col items-center space-y-4">
          {/* Pokemon Image */}
          <div className="relative">
            <Image
              src={pokemon.spriteUrl}
              alt={pokemon.name}
              width={96}
              height={96}
              className="h-24 w-24 object-contain"
            />
          </div>

          {/* Pokemon Name */}
          <div className="text-center">
            <h3 className="font-semibold text-lg capitalize">{pokemon.name}</h3>
          </div>

          {/* Pokemon Types */}
          <div className="flex flex-wrap gap-1 justify-center">
            {pokemon.types.map((type) => (
              <PokemonTypeTag
                key={type.name}
                type={type.name}
                className="text-xs"
              />
            ))}
          </div>

          {/* View Details Button */}
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(pokemon.id)}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
