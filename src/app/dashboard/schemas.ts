import { z } from "zod";

/**
 * Schema for creating a new deck
 */
export const createDeckSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  confidenceLevel: z.number().min(1).max(3).default(2), // 1: Less confident, 2: Medium, 3: More confident
});

/**
 * Schema for updating a deck
 */
export const updateDeckSchema = z.object({
  deckId: z.number().positive("Invalid deck ID"),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  confidenceLevel: z.number().min(1).max(3).optional(),
});

/**
 * Schema for deleting a deck
 */
export const deleteDeckSchema = z.object({
  deckId: z.number().positive("Invalid deck ID"),
});

/**
 * Schema for updating deck confidence level only
 */
export const updateDeckConfidenceSchema = z.object({
  deckId: z.number().positive("Invalid deck ID"),
  confidenceLevel: z.number().min(1).max(3),
});

/**
 * Schema for creating a new card
 */
export const createCardSchema = z.object({
  deckId: z.number().positive("Invalid deck ID"),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

/**
 * Schema for updating a card
 */
export const updateCardSchema = z.object({
  cardId: z.number().positive("Invalid card ID"),
  deckId: z.number().positive("Invalid deck ID"),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

/**
 * Schema for deleting a card
 */
export const deleteCardSchema = z.object({
  cardId: z.number().positive("Invalid card ID"),
  deckId: z.number().positive("Invalid deck ID"),
});

/**
 * Schema for reviewing a card (spaced repetition)
 */
export const reviewCardSchema = z.object({
  cardId: z.number().positive("Invalid card ID"),
  quality: z.number().min(0).max(5, "Quality must be between 0 and 5"),
});

// Export TypeScript types from schemas
export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
export type DeleteDeckInput = z.infer<typeof deleteDeckSchema>;
export type UpdateDeckConfidenceInput = z.infer<typeof updateDeckConfidenceSchema>;
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type DeleteCardInput = z.infer<typeof deleteCardSchema>;
export type ReviewCardInput = z.infer<typeof reviewCardSchema>;

