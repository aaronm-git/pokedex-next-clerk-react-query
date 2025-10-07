"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Move, Pokemon } from "@/types/pokemon";

function MovesCard({ moves }: { moves: Pokemon["moves"] }) {
  const [selectedMove, setSelectedMove] = useState<Move | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleMoveClick = (move: Move) => {
    setSelectedMove(move);
    setIsSheetOpen(true);
  };

  return (
    <>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Moves</CardTitle>
          <CardDescription>
            {moves.length
              ? `${moves.length} available moves`
              : "No moves available"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {moves.length > 0 ? (
            <ScrollArea className="h-[300px] pr-4">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {moves.map((move, index) => (
                  <button
                    key={`${move.name}-${index}`}
                    className="group relative rounded-lg border p-3 hover:bg-accent hover:shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-left w-full"
                    onClick={() => handleMoveClick(move)}
                    aria-label={`View details for ${move.awesomeName} move`}
                    type="button"
                  >
                    <p className="text-sm font-medium capitalize leading-tight">
                      {move.awesomeName}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">No moves available</p>
          )}
        </CardContent>
      </Card>

      {/* Single Sheet component for all moves */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="capitalize">
              {selectedMove?.awesomeName || "Move Details"}
            </SheetTitle>
            <SheetDescription>
              Detailed information about this Pokémon move
            </SheetDescription>
          </SheetHeader>

          {selectedMove && (
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              {/* Move Name Section */}
              <div className="grid gap-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Name
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold capitalize">
                    {selectedMove.awesomeName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ({selectedMove.name})
                  </p>
                </div>
              </div>

              {/* Pokemon Count Section */}
              <div className="grid gap-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Availability
                </div>
                <p className="text-sm">
                  This move can be learned by{" "}
                  {selectedMove.pokemonIds.length || "many"} Pokémon
                </p>
              </div>

              {/* Additional Info Badge */}
              <div className="grid gap-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Move Type
                </div>
                <Badge variant="secondary" className="w-fit">
                  Move
                </Badge>
              </div>

              {/* Placeholder for future move data */}
              <div className="grid gap-3">
                <div className="text-sm font-medium text-muted-foreground">
                  Description
                </div>
                <p className="text-sm text-muted-foreground">
                  More detailed move information would be available with
                  extended API data.
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}

export default MovesCard;
