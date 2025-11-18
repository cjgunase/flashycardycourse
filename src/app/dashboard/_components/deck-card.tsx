"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { updateDeckConfidenceAction } from "../actions";
import type { Deck } from "@/db/queries/decks";

const CONFIDENCE_LEVELS = {
  1: { label: "Less Confident", color: "bg-orange-100 border-orange-300 dark:bg-orange-950 dark:border-orange-800" },
  2: { label: "Medium", color: "bg-blue-100 border-blue-300 dark:bg-blue-950 dark:border-blue-800" },
  3: { label: "More Confident", color: "bg-green-100 border-green-300 dark:bg-green-950 dark:border-green-800" },
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

  const currentLevel = CONFIDENCE_LEVELS[confidenceLevel as keyof typeof CONFIDENCE_LEVELS];

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

        {/* Confidence slider - prevent link navigation */}
        <div 
          className="space-y-2"
          onClick={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Confidence
            </span>
            <span className="text-xs font-semibold text-foreground">
              {currentLevel.label}
            </span>
          </div>
          <Slider
            min={1}
            max={3}
            step={1}
            value={[confidenceLevel]}
            onValueChange={handleConfidenceChange}
            disabled={isUpdating}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Less</span>
            <span>Medium</span>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

