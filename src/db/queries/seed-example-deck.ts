import { db } from "@/db";
import { decksTable } from "@/db/schema";
import { createDeck } from "./decks";
import { createCard } from "./cards";
import { eq } from "drizzle-orm";
import {
    EXAMPLE_DECK_TITLE,
    EXAMPLE_DECK_DESCRIPTION,
    usmleCards,
} from "../usmle-seed-data";

/**
 * Check if a user already has the example deck
 * Returns true if the example deck exists for this user
 */
export async function hasExampleDeck(userId: string): Promise<boolean> {
    const existingDeck = await db.query.decksTable.findFirst({
        where: eq(decksTable.clerkUserId, userId),
    });

    // If user has ANY deck, we assume they either have the example deck
    // or they've already started using the app
    return existingDeck !== undefined;
}

/**
 * Create the example USMLE deck with all cards for a new user
 * This should only be called for users who don't have any decks yet
 */
export async function createExampleDeck(
    userId: string
): Promise<{ success: boolean; deckId?: number; error?: string }> {
    try {
        // Double-check that user doesn't have any decks
        const alreadyHasDecks = await hasExampleDeck(userId);
        if (alreadyHasDecks) {
            return {
                success: false,
                error: "User already has decks",
            };
        }

        // Create the deck
        const deck = await createDeck({
            userId,
            title: EXAMPLE_DECK_TITLE,
            description: EXAMPLE_DECK_DESCRIPTION,
            confidenceLevel: 2, // Default to intermediate
        });

        // Create all cards
        // We'll do this sequentially to maintain order and handle errors better
        let cardsCreated = 0;
        for (const cardData of usmleCards) {
            await createCard({
                deckId: deck.id,
                question: cardData.question,
                answer: cardData.answer,
                confidenceLevel: cardData.confidenceLevel,
            });
            cardsCreated++;
        }

        return {
            success: true,
            deckId: deck.id,
        };
    } catch (error) {
        console.error("Failed to create example deck:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}
