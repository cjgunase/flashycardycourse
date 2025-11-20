import { db } from "@/db";
import { cardsTable, decksTable } from "@/db/schema";
import { eq, and, lte, isNull, or, sql } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type Card = InferSelectModel<typeof cardsTable>;
export type NewCard = InferInsertModel<typeof cardsTable>;

/**
 * Get all cards for a specific deck
 */
export async function getCardsByDeckId(deckId: number): Promise<Card[]> {
  return await db
    .select()
    .from(cardsTable)
    .where(eq(cardsTable.deckId, deckId));
}

/**
 * Get a single card by ID
 */
export async function getCardById(cardId: number): Promise<Card | undefined> {
  return await db.query.cardsTable.findFirst({
    where: eq(cardsTable.id, cardId),
  });
}

/**
 * Verify that a user owns the deck that contains a card
 */
export async function verifyDeckOwnership(
  deckId: number,
  userId: string
): Promise<boolean> {
  const deck = await db.query.decksTable.findFirst({
    where: and(
      eq(decksTable.id, deckId),
      eq(decksTable.clerkUserId, userId)
    ),
  });
  return !!deck;
}

/**
 * Create a new card in a deck
 */
export async function createCard(data: {
  deckId: number;
  question: string;
  answer: string;
  image?: string;
}): Promise<Card> {
  const [newCard] = await db
    .insert(cardsTable)
    .values({
      deckId: data.deckId,
      question: data.question,
      answer: data.answer,
      image: data.image,
    })
    .returning();

  return newCard;
}

/**
 * Update a card's question and/or answer
 */
export async function updateCard(data: {
  cardId: number;
  deckId: number;
  question: string;
  answer: string;
  image?: string;
}): Promise<Card | null> {
  const [updatedCard] = await db
    .update(cardsTable)
    .set({
      question: data.question,
      answer: data.answer,
      image: data.image,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(cardsTable.id, data.cardId),
        eq(cardsTable.deckId, data.deckId)
      )
    )
    .returning();

  return updatedCard || null;
}

/**
 * Delete a card
 */
export async function deleteCard(
  cardId: number,
  deckId: number
): Promise<boolean> {
  const result = await db
    .delete(cardsTable)
    .where(
      and(eq(cardsTable.id, cardId), eq(cardsTable.deckId, deckId))
    );

  return result.rowCount > 0;
}

/**
 * Get cards that are due for review (for spaced repetition)
 */
export async function getDueCards(deckId: number): Promise<Card[]> {
  const now = new Date();
  return await db
    .select()
    .from(cardsTable)
    .where(
      and(
        eq(cardsTable.deckId, deckId),
        or(
          lte(cardsTable.nextDueAt, now),
          isNull(cardsTable.nextDueAt)
        )
      )
    );
}

/**
 * Update card review data (for spaced repetition)
 */
export async function updateCardReview(data: {
  cardId: number;
  easeFactor: number;
  nextDueAt: Date;
}): Promise<Card | null> {
  const [updatedCard] = await db
    .update(cardsTable)
    .set({
      lastReviewedAt: new Date(),
      nextDueAt: data.nextDueAt,
      easeFactor: data.easeFactor,
      reviewCount: sql`${cardsTable.reviewCount} + 1`,
    })
    .where(eq(cardsTable.id, data.cardId))
    .returning();

  return updatedCard || null;
}

