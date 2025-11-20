"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateDeckConfidenceAction } from "../actions";
import type { Deck } from "@/db/queries/decks";

const PROFICIENCY_LEVELS = {
  1: { label: "Beginner", color: "bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800" },
  2: { label: "Intermediate", color: "bg-blue-100 border-blue-300 dark:bg-blue-950 dark:border-blue-800" },
  3: { label: "Advanced", color: "bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-800" },
};

interface DeckCardProps {
  deck: Deck;
}

export function DeckCard({ deck }: DeckCardProps) {
  const [confidenceLevel, setConfidenceLevel] = useState(deck.confidenceLevel);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleConfidenceChange(value: number[]) {
    const newLevel = value[0];
    setConfidenceLevel(newLevel);
    setIsUpdating(true);

    try {
      await updateDeckConfidenceAction({
        deckId: deck.id,
        confidenceLevel: newLevel,
      });
    } catch (error) {
      console.error("Failed to update confidence level:", error);
      // Revert on error
      setConfidenceLevel(deck.confidenceLevel);
    } finally {
      setIsUpdating(false);
    }
  }

  const currentLevel = PROFICIENCY_LEVELS[confidenceLevel as keyof typeof PROFICIENCY_LEVELS];

  return (
    <Card className={`group h-full border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${currentLevel.color}`}>
      {/* Clickable area for navigation */}
      <Link href={`/decks/${deck.id}`} className="block">
        <CardHeader>
          <CardTitle className="text-card-foreground group-hover:text-primary transition-colors">
            {deck.title}
          </CardTitle>
          {deck.description && (
            <CardDescription className="text-muted-foreground line-clamp-2">
              {deck.description}
            </CardDescription>
          )}
        </CardHeader>
      </Link>

      <CardContent className="space-y-3">
        {/* Date info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Updated {new Date(deck.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Proficiency segmented control - prevent link navigation */}
        <div
          className="space-y-2"
          onClick={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Proficiency
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-lg">
            <Button
              variant={confidenceLevel === 1 ? "default" : "ghost"}
              size="sm"
              onClick={() => handleConfidenceChange([1])}
              disabled={isUpdating}
              className={`text-xs h-8 ${confidenceLevel === 1
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "hover:bg-orange-100 dark:hover:bg-orange-950 text-foreground"
                }`}
            >
              Beginner
            </Button>
            <Button
              variant={confidenceLevel === 2 ? "default" : "ghost"}
              size="sm"
              onClick={() => handleConfidenceChange([2])}
              disabled={isUpdating}
              className={`text-xs h-8 ${confidenceLevel === 2
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "hover:bg-blue-100 dark:hover:bg-blue-950 text-foreground"
                }`}
            >
              Intermediate
            </Button>
            <Button
              variant={confidenceLevel === 3 ? "default" : "ghost"}
              size="sm"
              onClick={() => handleConfidenceChange([3])}
              disabled={isUpdating}
              className={`text-xs h-8 ${confidenceLevel === 3
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "hover:bg-green-100 dark:hover:bg-green-950 text-foreground"
                }`}
            >
              Advanced
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

