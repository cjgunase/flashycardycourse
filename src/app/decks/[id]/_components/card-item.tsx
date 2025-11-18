"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { EditCardDialog } from "./edit-card-dialog";
import { DeleteCardDialog } from "./delete-card-dialog";
import type { Card as CardType } from "@/db/queries/cards";

interface CardItemProps {
  card: CardType;
  deckId: number;
  cardNumber: number;
}

export function CardItem({ card, deckId, cardNumber }: CardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<"done" | "needs-revision" | null>(null);
  const [showAiHelp, setShowAiHelp] = useState(false);

  return (
    <Card className="border-2 border-border bg-card hover:border-primary/50 transition-colors">
      <CardHeader>
        {/* Top Row: Card Number and Review Status */}
        <div className="flex items-center justify-between mb-4">
          {/* Card Number - Top Left */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Card #{cardNumber}
            </span>
          </div>

          {/* Review Status Radio Buttons - Top Right */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`review-status-${card.id}`}
                value="done"
                checked={reviewStatus === "done"}
                onChange={() => setReviewStatus("done")}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-foreground">Done</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`review-status-${card.id}`}
                value="needs-revision"
                checked={reviewStatus === "needs-revision"}
                onChange={() => setReviewStatus("needs-revision")}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-foreground">Need further revision</span>
            </label>
          </div>
        </div>

        {/* Question Section */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                QUESTION
              </span>
            </div>
            <p className="text-card-foreground whitespace-pre-wrap">
              {card.question}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <EditCardDialog card={card} deckId={deckId} />
            <DeleteCardDialog cardId={card.id} deckId={deckId} />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Get AI Help Button - Shows when "Need further revision" is selected */}
        {reviewStatus === "needs-revision" && (
          <div className="mb-4">
            <Button
              onClick={() => setShowAiHelp(!showAiHelp)}
              variant="outline"
              className="w-full border-orange-500/50 text-orange-600 hover:bg-orange-500/10 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {showAiHelp ? "Hide AI Help" : "Get AI Help"}
            </Button>
          </div>
        )}

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
            <p className="text-card-foreground whitespace-pre-wrap">
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
              <p className="italic">
                AI-generated context and explanations will appear here to help you better understand this card.
              </p>
              <p className="mt-2 text-xs text-orange-600/70 dark:text-orange-400/70">
                Coming soon: Additional explanations, mnemonics, and related concepts.
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Created {new Date(card.createdAt).toLocaleDateString()}</span>
          {card.reviewCount > 0 && (
            <span>Reviewed {card.reviewCount} times</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

