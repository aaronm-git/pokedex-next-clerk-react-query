import { Badge } from "@/components/ui/badge";
import { POKEMON_TYPE_COLORS, type PokemonType } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PokemonTypeTagProps {
  type: string;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function PokemonTypeTag({
  type,
  className,
  variant = "default",
}: PokemonTypeTagProps) {
  const normalizedType = type.toLowerCase() as PokemonType;
  const color =
    POKEMON_TYPE_COLORS[normalizedType] || POKEMON_TYPE_COLORS.unknown;

  const getTextColor = (backgroundColor: string) => {
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const textColor = getTextColor(color);

  return (
    <Badge
      variant={variant}
      className={cn("capitalize font-medium border-0", className)}
      style={{
        backgroundColor: color,
        color: textColor,
      }}
    >
      {type}
    </Badge>
  );
}
