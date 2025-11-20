"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createDeck as createDeckQuery,
  updateDeck as updateDeckQuery,
  deleteDeck as deleteDeckQuery,
  updateDeckConfidence as updateDeckConfidenceQuery,
} from "@/db/queries/decks";
import {
  createCard as createCardQuery,
  updateCard as updateCardQuery,
  deleteCard as deleteCardQuery,
  updateCardConfidence as updateCardConfidenceQuery,
  verifyDeckOwnership,
} from "@/db/queries/cards";
import {
  createDeckSchema,
  updateDeckSchema,
  deleteDeckSchema,
  updateDeckConfidenceSchema,
  createCardSchema,
  updateCardSchema,
  deleteCardSchema,
  updateCardConfidenceSchema,
  reviewCardSchema,
  generateAIDeckSchema,
  type CreateDeckInput,
  type UpdateDeckInput,
  type DeleteDeckInput,
  type UpdateDeckConfidenceInput,
  type CreateCardInput,
  type UpdateCardInput,
  type DeleteCardInput,
  type UpdateCardConfidenceInput,
  type ReviewCardInput,
  type GenerateAIDeckInput,
} from "./schemas";

/**
 * Create a new deck
 */
export async function createDeckAction(input: CreateDeckInput) {
  try {
    // 1. Validate input with Zod
    const validatedInput = createDeckSchema.parse(input);

    // 2. Authenticate user
    const { userId, has } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // 3. Check if user has unlimited decks feature
    const hasUnlimitedDecks = await has({ feature: "unlimited_decks" });

    if (!hasUnlimitedDecks) {
      // Free user - check deck count
      const { getUserDecks } = await import("@/db/queries/decks");
      const existingDecks = await getUserDecks(userId);

      if (existingDecks.length >= 3) {
        return {
          success: false,
          error: "Free users can create up to 3 decks. Upgrade to Pro for unlimited decks.",
          requiresUpgrade: true,
        };
      }
    }

    // 4. Call query function - NEVER access db directly
    const newDeck = await createDeckQuery({
      userId,
      title: validatedInput.title,
      description: validatedInput.description,
      confidenceLevel: validatedInput.confidenceLevel,
    });

    // 5. Revalidate affected paths
    revalidatePath("/dashboard");

    return { success: true, deck: newDeck };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Failed to create deck:", error);
    return { success: false, error: "Failed to create deck" };
  }
}

/**
 * Update an existing deck
 */
export async function updateDeckAction(input: UpdateDeckInput) {
  try {
    const validatedInput = updateDeckSchema.parse(input);
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedDeck = await updateDeckQuery({
      deckId: validatedInput.deckId,
      userId,
      title: validatedInput.title,
      description: validatedInput.description,
      confidenceLevel: validatedInput.confidenceLevel,
    });

    if (!updatedDeck) {
      return { success: false, error: "Deck not found or access denied" };
    }

    revalidatePath("/dashboard");
    revalidatePath(`/decks/${validatedInput.deckId}`);

    return { success: true, deck: updatedDeck };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Failed to update deck:", error);
    return { success: false, error: "Failed to update deck" };
  }
}

/**
 * Update deck confidence level only
 */
export async function updateDeckConfidenceAction(input: UpdateDeckConfidenceInput) {
  try {
    const validatedInput = updateDeckConfidenceSchema.parse(input);
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedDeck = await updateDeckConfidenceQuery(
      validatedInput.deckId,
      userId,
      validatedInput.confidenceLevel
    );

    if (!updatedDeck) {
      return { success: false, error: "Deck not found or access denied" };
    }

    revalidatePath("/dashboard");

    return { success: true, deck: updatedDeck };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Failed to update deck confidence:", error);
    return { success: false, error: "Failed to update deck confidence" };
  }
}

/**
 * Delete a deck
 */
export async function deleteDeckAction(input: DeleteDeckInput) {
  try {
    const validatedInput = deleteDeckSchema.parse(input);
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const success = await deleteDeckQuery(validatedInput.deckId, userId);

    if (!success) {
      return { success: false, error: "Deck not found or access denied" };
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Failed to delete deck:", error);
    return { success: false, error: "Failed to delete deck" };
  }
}

/**
 * Create a new card in a deck
 */
export async function createCardAction(input: CreateCardInput) {
  try {
    const validatedInput = createCardSchema.parse(input);
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify user owns the deck
    const ownsDeack = await verifyDeckOwnership(validatedInput.deckId, userId);
    if (!ownsDeack) {
      return { success: false, error: "Deck not found or access denied" };
    }

    const newCard = await createCardQuery({
      deckId: validatedInput.deckId,
      question: validatedInput.question,
      answer: validatedInput.answer,
      confidenceLevel: validatedInput.confidenceLevel,
      image: validatedInput.image,
    });

    revalidatePath(`/decks/${validatedInput.deckId}`);

    return { success: true, card: newCard };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Failed to create card:", error);
    return { success: false, error: "Failed to create card" };
  }
}

/**
 * Update an existing card
 */
export async function updateCardAction(input: UpdateCardInput) {
  try {
    const validatedInput = updateCardSchema.parse(input);
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify user owns the deck
    const ownsDeck = await verifyDeckOwnership(validatedInput.deckId, userId);
    if (!ownsDeck) {
      return { success: false, error: "Deck not found or access denied" };
    }

    const updatedCard = await updateCardQuery({
      cardId: validatedInput.cardId,
      deckId: validatedInput.deckId,
      question: validatedInput.question,
      answer: validatedInput.answer,
      confidenceLevel: validatedInput.confidenceLevel,
      image: validatedInput.image,
    });

    if (!updatedCard) {
      return { success: false, error: "Card not found" };
    }

    revalidatePath(`/decks/${validatedInput.deckId}`);

    return { success: true, card: updatedCard };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Failed to update card:", error);
    return { success: false, error: "Failed to update card" };
  }
}

/**
 * Update card confidence level only
 */
export async function updateCardConfidenceAction(input: UpdateCardConfidenceInput) {
  try {
    const validatedInput = updateCardConfidenceSchema.parse(input);
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // We need to verify ownership, but we only have cardId
    // We'll need to get the card first to find its deckId
    const { getCardById } = await import("@/db/queries/cards");
    const card = await getCardById(validatedInput.cardId);

    if (!card) {
      return { success: false, error: "Card not found" };
    }

    // Verify user owns the deck that contains this card
    const ownsDeck = await verifyDeckOwnership(card.deckId, userId);
    if (!ownsDeck) {
      return { success: false, error: "Access denied" };
    }

    const updatedCard = await updateCardConfidenceQuery({
      cardId: validatedInput.cardId,
      confidenceLevel: validatedInput.confidenceLevel,
    });

    if (!updatedCard) {
      return { success: false, error: "Card not found" };
    }

    revalidatePath(`/decks/${card.deckId}`);

    return { success: true, card: updatedCard };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Failed to update card confidence:", error);
    return { success: false, error: "Failed to update card confidence" };
  }
}

/**
 * Delete a card
 */
export async function deleteCardAction(input: DeleteCardInput) {
  try {
    const validatedInput = deleteCardSchema.parse(input);
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify user owns the deck
    const ownsDeck = await verifyDeckOwnership(validatedInput.deckId, userId);
    if (!ownsDeck) {
      return { success: false, error: "Deck not found or access denied" };
    }

    const success = await deleteCardQuery(
      validatedInput.cardId,
      validatedInput.deckId
    );

    if (!success) {
      return { success: false, error: "Card not found" };
    }

    revalidatePath(`/decks/${validatedInput.deckId}`);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Failed to delete card:", error);
    return { success: false, error: "Failed to delete card" };
  }
}

/**
 * Review a card and update its spaced repetition data
 */
export async function reviewCardAction(input: ReviewCardInput) {
  try {
    const validatedInput = reviewCardSchema.parse(input);
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the card to find its deckId and current SRS data
    const { getCardById } = await import("@/db/queries/cards");
    const card = await getCardById(validatedInput.cardId);

    if (!card) {
      return { success: false, error: "Card not found" };
    }

    // Verify user owns the deck that contains this card
    const ownsDeck = await verifyDeckOwnership(card.deckId, userId);
    if (!ownsDeck) {
      return { success: false, error: "Access denied" };
    }

    // Calculate next review using SRS algorithm
    const { calculateNextReview, getCurrentInterval } = await import("@/lib/srs-utils");

    const currentInterval = getCurrentInterval(card.lastReviewedAt);
    const { intervalDays, nextDueAt } = calculateNextReview(
      currentInterval,
      validatedInput.confidenceRating as 1 | 2 | 3
    );

    // Update card review data
    const { updateCardReview } = await import("@/db/queries/cards");
    const updatedCard = await updateCardReview({
      cardId: validatedInput.cardId,
      easeFactor: card.easeFactor || 2.5, // Keep existing ease factor for now
      nextDueAt,
    });

    if (!updatedCard) {
      return { success: false, error: "Failed to update card" };
    }

    revalidatePath(`/decks/${card.deckId}`);

    return {
      success: true,
      card: updatedCard,
      intervalDays, // Return for debugging/display purposes
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Failed to review card:", error);
    return { success: false, error: "Failed to review card" };
  }
}

/**
 * Generate a deck with AI using OpenAI API
 */
export async function generateAIDeckAction(input: GenerateAIDeckInput) {
  try {
    // 1. Validate input with Zod
    const validatedInput = generateAIDeckSchema.parse(input);

    // 2. Authenticate user
    const { userId, has } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // 3. Check if user has AI helper feature (Pro plan)
    const hasAiHelper = await has({ feature: "ai_helper" });
    if (!hasAiHelper) {
      return {
        success: false,
        error: "AI deck generation is only available for Pro users. Upgrade to access this feature.",
        requiresUpgrade: true,
      };
    }

    // 4. Check deck limit for users without unlimited decks
    const hasUnlimitedDecks = await has({ feature: "unlimited_decks" });
    if (!hasUnlimitedDecks) {
      const { getUserDecks } = await import("@/db/queries/decks");
      const existingDecks = await getUserDecks(userId);

      if (existingDecks.length >= 3) {
        return {
          success: false,
          error: "Free users can create up to 3 decks. Upgrade to Pro for unlimited decks.",
          requiresUpgrade: true,
        };
      }
    }

    // 5. Call OpenAI API
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are an expert at creating flashcards for spaced repetition learning. Follow these principles from cognitive science research:

# Core Principles
- Spacing effect: Cards should encourage spaced repetition
- Retrieval practice: Questions should require active recall
- Desirable difficulties: Make prompts generative, not just recognition
- Encoding variability: Use multiple perspectives
- Interleaving: Mix different concepts
- Elaboration & dual coding: Include explanations and visual/conceptual connections

# Card Design Guidelines
- Create atomic but non-trivial cards (one concept per card, but not overly simple)
- Use generative prompts that require the learner to produce an answer
- Include explanations or mnemonics in the answer when helpful
- For complex topics, create chains of reasoning across multiple cards
- Include relevant visual descriptions or conceptual connections

# Response Format
You MUST respond with a valid JSON object in this exact format:
{
  "title": "A descriptive title for the deck (max 100 characters)",
  "description": "A brief description of what this deck covers (max 500 characters)",
  "cards": [
    {
      "question": "The question or prompt",
      "answer": "The answer, including explanations, mnemonics, or visual descriptions when helpful"
    }
  ]
}

Create 10-30 cards depending on the content complexity. Ensure variety in card types and difficulty.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { 
          role: "user", 
          content: `Create a flashcard deck from the following content:\n\n${validatedInput.content}` 
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;
    if (!aiResponse) {
      return { success: false, error: "Failed to generate content from AI" };
    }

    // 6. Parse AI response
    let deckData: {
      title: string;
      description?: string;
      cards: Array<{ question: string; answer: string }>;
    };

    try {
      deckData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return { success: false, error: "Failed to parse AI response" };
    }

    // 7. Validate the parsed data
    if (!deckData.title || !deckData.cards || !Array.isArray(deckData.cards)) {
      return { success: false, error: "AI response is missing required fields" };
    }

    if (deckData.cards.length === 0) {
      return { success: false, error: "AI did not generate any cards" };
    }

    // 8. Create the deck
    const newDeck = await createDeckQuery({
      userId,
      title: deckData.title.slice(0, 100), // Ensure max length
      description: deckData.description?.slice(0, 500), // Ensure max length
      confidenceLevel: 2, // Default medium confidence
    });

    // 9. Create all cards in the deck
    const { createCard: createCardQuery } = await import("@/db/queries/cards");
    
    const createdCards = await Promise.all(
      deckData.cards.map((card) =>
        createCardQuery({
          deckId: newDeck.id,
          question: card.question,
          answer: card.answer,
          confidenceLevel: 2, // Default medium confidence
        })
      )
    );

    // 10. Revalidate affected paths
    revalidatePath("/dashboard");
    revalidatePath(`/decks/${newDeck.id}`);

    return {
      success: true,
      deck: newDeck,
      cardCount: createdCards.length,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        errors: error.flatten().fieldErrors,
      };
    }
    console.error("Failed to generate AI deck:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to generate deck with AI" 
    };
  }
}

