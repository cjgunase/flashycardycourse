import { db } from "@/db";
import { decksTable } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type Deck = InferSelectModel<typeof decksTable>;
export type NewDeck = InferInsertModel<typeof decksTable>;

/**
 * Get all decks for a specific user, ordered by most recently updated
 */
export async function getUserDecks(userId: string): Promise<Deck[]> {
  return await db
    .select()
    .from(decksTable)
    .where(eq(decksTable.clerkUserId, userId))
    .orderBy(desc(decksTable.updatedAt));
}

/**
 * Get a single deck by ID with ownership verification
 */
export async function getDeckById(
  deckId: number,
  userId: string
): Promise<Deck | undefined> {
  return await db.query.decksTable.findFirst({
    where: and(
      eq(decksTable.id, deckId),
      eq(decksTable.clerkUserId, userId)
    ),
    with: { cards: true },
  });
}

/**
 * Create a new deck for a user
 */
export async function createDeck(data: {
  userId: string;
  title: string;
  description?: string;
  confidenceLevel?: number;
}): Promise<Deck> {
  const [newDeck] = await db
    .insert(decksTable)
    .values({
      clerkUserId: data.userId,
      title: data.title,
      description: data.description,
      confidenceLevel: data.confidenceLevel ?? 2,
    })
    .returning();

  return newDeck;
}

/**
 * Update a deck's title and/or description with ownership verification
 */
export async function updateDeck(data: {
  deckId: number;
  userId: string;
  title: string;
  description?: string;
  confidenceLevel?: number;
}): Promise<Deck | null> {
  const updateData: {
    title: string;
    description?: string;
    confidenceLevel?: number;
    updatedAt: Date;
  } = {
    title: data.title,
    description: data.description,
    updatedAt: new Date(),
  };

  if (data.confidenceLevel !== undefined) {
    updateData.confidenceLevel = data.confidenceLevel;
  }

  const [updatedDeck] = await db
    .update(decksTable)
    .set(updateData)
    .where(
      and(
        eq(decksTable.id, data.deckId),
        eq(decksTable.clerkUserId, data.userId)
      )
    )
    .returning();

  return updatedDeck || null;
}

/**
 * Update only the confidence level of a deck
 */
export async function updateDeckConfidence(
  deckId: number,
  userId: string,
  confidenceLevel: number
): Promise<Deck | null> {
  const [updatedDeck] = await db
    .update(decksTable)
    .set({
      confidenceLevel,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(decksTable.id, deckId),
        eq(decksTable.clerkUserId, userId)
      )
    )
    .returning();

  return updatedDeck || null;
}

/**
 * Delete a deck with ownership verification
 * Note: Cards will be automatically deleted due to cascade delete
 */
export async function deleteDeck(
  deckId: number,
  userId: string
): Promise<boolean> {
  const result = await db
    .delete(decksTable)
    .where(
      and(
        eq(decksTable.id, deckId),
        eq(decksTable.clerkUserId, userId)
      )
    );

  return result.rowCount > 0;
}

