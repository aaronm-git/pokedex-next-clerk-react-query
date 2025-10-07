"use client";

import { Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useFavorites } from "@/hooks/use-favorites";

interface PkmnActionButtonsProps {
  pokemonId: number;
  isFavorited?: boolean;
}

export default function PkmnActionButtons({
  pokemonId,
  isFavorited: propIsFavorited = false,
}: PkmnActionButtonsProps) {
  const [isFavorited, setIsFavorited] = useState(propIsFavorited);
  const { isFavorite, removeFavorite, addFavorite } = useFavorites();

  useEffect(() => {
    const checkFavoritedStatus = () => {
      try {
        const favorited = isFavorite(pokemonId);
        setIsFavorited(favorited);
      } catch (error) {
        console.error("Error checking favorited status:", error);
        setIsFavorited(false);
      }
    };

    checkFavoritedStatus();
  }, [pokemonId, isFavorite]);

  const handleFavorite = () => {
    try {
      if (isFavorited) {
        removeFavorite(pokemonId);
        setIsFavorited(false);
        toast.success("Pokémon removed from favorites");
      } else {
        addFavorite(pokemonId);
        setIsFavorited(true);
        toast.success("Pokémon added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      toast.error("Failed to update Pokémon favorite status");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Pokémon #${pokemonId}`,
      text: `Check out this Pokémon!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Pokémon shared successfully");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Pokémon link copied to clipboard");
      }
    } catch (error) {
      const err = error as Error;
      const isUserDismissed =
        err.name === "AbortError" || err.name === "NotAllowedError";

      if (!isUserDismissed) {
        console.error("Error sharing:", error);
        toast.error("Failed to share Pokémon");
      }
    }
  };

  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button
          variant={isFavorited ? "default" : "outline"}
          onClick={handleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          <span className="ml-2 hidden sm:inline">
            {isFavorited ? "Unfavorite" : "Favorite"}
          </span>
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Share</span>
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}
