"use client";

import { useState } from "react";
import { CardItem } from "./card-item";
import type { Card } from "@/db/queries/cards";

interface DeckViewProps {
    initialCards: Card[];
    deckId: number;
}

export function DeckView({ initialCards, deckId }: DeckViewProps) {
    const [cards, setCards] = useState<Card[]>(initialCards);

    const handleMarkDone = (cardId: number) => {
        setCards((prevCards) => {
            const cardIndex = prevCards.findIndex((c) => c.id === cardId);
            if (cardIndex === -1) return prevCards;

            const newCards = [...prevCards];
            const [movedCard] = newCards.splice(cardIndex, 1);
            newCards.push(movedCard);
            return newCards;
        });
    };

    return (
        <div className="space-y-4">
            {cards.map((card, index) => (
                <CardItem
                    key={card.id}
                    card={card}
                    deckId={deckId}
                    cardNumber={index + 1}
                    onMarkDone={() => handleMarkDone(card.id)}
                />
            ))}
        </div>
    );
}
