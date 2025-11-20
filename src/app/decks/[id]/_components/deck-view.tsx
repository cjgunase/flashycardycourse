"use client";

import { useState, useEffect } from "react";
import { CardItem } from "./card-item";
import type { Card } from "@/db/queries/cards";
import { selectCardsForReview } from "@/lib/srs-utils";

interface DeckViewProps {
    initialCards: Card[];
    deckId: number;
}

export function DeckView({ initialCards, deckId }: DeckViewProps) {
    // Filter and sort cards using SRS algorithm
    const [dueCards, setDueCards] = useState<Card[]>([]);
    const [reviewedCardIds, setReviewedCardIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        // Select cards for review using weighted sampling
        const selectedCards = selectCardsForReview(initialCards);
        setDueCards(selectedCards);
    }, [initialCards]);

    // Get cards that haven't been reviewed yet in this session
    const visibleCards = dueCards.filter(card => !reviewedCardIds.has(card.id));

    const handleCardReviewed = (cardId: number) => {
        // Mark card as reviewed and remove from visible cards
        setReviewedCardIds(prev => new Set(prev).add(cardId));
    };

    if (visibleCards.length === 0 && dueCards.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                    🎉 Great job! No cards are due for review right now.
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                    Come back later to continue your studies.
                </p>
            </div>
        );
    }

    if (visibleCards.length === 0 && reviewedCardIds.size > 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                    ✅ You've reviewed all due cards for today!
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                    You reviewed {reviewedCardIds.size} card{reviewedCardIds.size !== 1 ? 's' : ''} this session.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Progress indicator */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        Cards due today: <span className="font-semibold text-foreground">{dueCards.length}</span>
                    </span>
                    <span className="text-muted-foreground">
                        Reviewed: <span className="font-semibold text-foreground">{reviewedCardIds.size}</span>
                    </span>
                    <span className="text-muted-foreground">
                        Remaining: <span className="font-semibold text-foreground">{visibleCards.length}</span>
                    </span>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(reviewedCardIds.size / dueCards.length) * 100}%` }}
                    />
                </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4 text-center">
                Use the slider to mark how you feel about the card. The card will be automatically marked as reviewed.
            </p>

            {/* Card list */}
            {visibleCards.map((card, index) => (
                <CardItem
                    key={card.id}
                    card={card}
                    deckId={deckId}
                    cardNumber={index + 1}
                    onCardReviewed={() => handleCardReviewed(card.id)}
                />
            ))}
        </div>
    );
}
