"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { EditCardDialog } from "./edit-card-dialog";
import { DeleteCardDialog } from "./delete-card-dialog";
import { updateCardConfidenceAction } from "@/app/dashboard/actions";
import type { Card as CardType } from "@/db/queries/cards";

const CONFIDENCE_LEVELS = {
  1: { label: "Less Confident", color: "text-orange-600 dark:text-orange-400" },
  2: { label: "Medium", color: "text-blue-600 dark:text-blue-400" },
  3: { label: "More Confident", color: "text-green-600 dark:text-green-400" },
};

interface CardItemProps {
  card: CardType;
  deckId: number;
  cardNumber: number;
  onCardReviewed?: () => void;
}

export function CardItem({ card, deckId, cardNumber, onCardReviewed }: CardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAiHelp, setShowAiHelp] = useState(false);
  const [aiHelpContent, setAiHelpContent] = useState<string | null>(card.aiHelp || null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(card.confidenceLevel || 2);
  const [isUpdatingConfidence, setIsUpdatingConfidence] = useState(false);

  const handleGetAiHelp = async () => {
    const newShowAiHelp = !showAiHelp;
    setShowAiHelp(newShowAiHelp);

    if (newShowAiHelp && !aiHelpContent) {
      setIsLoadingAi(true);
      try {
        const response = await fetch("/api/ai-help", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: card.question,
            answer: card.answer,
            cardId: card.id,
          }),
        });
        const data = await response.json();
        if (data.response) {
          setAiHelpContent(data.response);
        }
      } catch (error) {
        console.error("Failed to get AI help:", error);
      } finally {
        setIsLoadingAi(false);
      }
    }
  };

  async function handleConfidenceChange(value: number[]) {
    const newLevel = value[0];
    setConfidenceLevel(newLevel);
    setIsUpdatingConfidence(true);

    try {
      // Update confidence level
      await updateCardConfidenceAction({
        cardId: card.id,
        confidenceLevel: newLevel,
      });

      // Auto-review the card
      const { reviewCardAction } = await import("@/app/dashboard/actions");
      const result = await reviewCardAction({
        cardId: card.id,
        confidenceRating: newLevel as 1 | 2 | 3,
      });

      if (result.success) {
        onCardReviewed?.();
      } else {
        console.error("Failed to review card:", result.error);
      }
    } catch (error) {
      console.error("Failed to update confidence level or review card:", error);
      // Revert on error
      setConfidenceLevel(card.confidenceLevel || 2);
    } finally {
      setIsUpdatingConfidence(false);
    }
  }

  const currentLevel = CONFIDENCE_LEVELS[confidenceLevel as keyof typeof CONFIDENCE_LEVELS];

  return (
    <Card className="border-2 border-border bg-card hover:border-primary/50 transition-colors">
      <CardHeader className="space-y-4">
        {/* Top Row: Card Number */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Card Number - Top Left */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              Card #{cardNumber}
            </span>
          </div>
        </div>

        {/* Question Section */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                QUESTION
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <EditCardDialog card={card} deckId={deckId} />
              <DeleteCardDialog cardId={card.id} deckId={deckId} />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-card-foreground whitespace-pre-wrap break-words">
              {card.question}
            </p>
          </div>

          {/* Display image if present */}
          {card.image && (
            <div className="mt-4 flex justify-center">
              <img
                src={card.image}
                alt="Card image"
                className="max-w-full max-h-96 rounded-lg border border-border object-contain"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Get AI Help Button - Always visible */}
        <div className="mb-4">
          <Button
            onClick={handleGetAiHelp}
            variant="outline"
            className={`w-full border-orange-500/50 text-orange-600 hover:bg-orange-500/10 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 ${isLoadingAi ? "animate-pulse border-orange-500 ring-1 ring-orange-500" : ""
              }`}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {showAiHelp ? "Hide AI Help" : "Get AI Help"}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-between text-muted-foreground hover:text-foreground mb-2"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <span>{isFlipped ? "Hide Answer" : "Show Answer"}</span>
          {isFlipped ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {isFlipped && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-600/10 px-2 py-1 rounded">
                ANSWER
              </span>
            </div>
            <p className="text-card-foreground whitespace-pre-wrap break-words">
              {card.answer}
            </p>
          </div>
        )}

        {/* AI Help Context Section - Shows when "Get AI Help" is clicked */}
        {showAiHelp && (
          <div className="mt-4 p-4 bg-orange-500/5 rounded-lg border-2 border-orange-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-600/10 px-2 py-1 rounded">
                AI HELP
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {isLoadingAi ? (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>Generating helpful hints...</span>
                </div>
              ) : aiHelpContent ? (
                <p className="whitespace-pre-wrap">{aiHelpContent}</p>
              ) : (
                <p className="italic">
                  AI-generated context and explanations will appear here to help you better understand this card.
                </p>
              )}
              {!isLoadingAi && !aiHelpContent && (
                <p className="mt-2 text-xs text-orange-600/70 dark:text-orange-400/70">
                  Click "Get AI Help" to generate hints.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 text-xs text-muted-foreground">
          <span>Created {new Date(card.createdAt).toLocaleDateString()}</span>
          {card.reviewCount > 0 && (
            <span>Reviewed {card.reviewCount} times</span>
          )}
        </div>

        {/* Confidence slider */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              Confidence:
            </span>
            <Slider
              min={1}
              max={3}
              step={1}
              value={[confidenceLevel]}
              onValueChange={handleConfidenceChange}
              disabled={isUpdatingConfidence}
              className="max-w-32"
            />
            <span className={`text-xs font-semibold ${currentLevel.color} whitespace-nowrap`}>
              {currentLevel.label}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

