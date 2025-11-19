"use server";

import { auth } from "@clerk/nextjs/server";
import { getDeckById } from "@/db/queries/decks";

/**
 * Generate markdown content for a deck with all its cards
 */
export async function generateDeckMarkdown(deckId: number) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Fetch deck with cards using query function
  const deck = await getDeckById(deckId, userId);

  if (!deck) {
    throw new Error("Deck not found or access denied");
  }

  // Generate markdown content
  let markdown = `# ${deck.title}\n\n`;

  if (deck.description) {
    markdown += `${deck.description}\n\n`;
  }

  markdown += `---\n\n`;
  markdown += `**Total Cards:** ${deck.cards?.length || 0}\n`;
  markdown += `**Created:** ${new Date(deck.createdAt).toLocaleDateString()}\n`;
  markdown += `**Last Updated:** ${new Date(deck.updatedAt).toLocaleDateString()}\n\n`;
  markdown += `---\n\n`;

  // Add cards
  if (deck.cards && deck.cards.length > 0) {
    markdown += `## Flashcards\n\n`;

    deck.cards.forEach((card, index) => {
      markdown += `### Card ${index + 1}\n\n`;
      markdown += `**Question:**\n\n`;
      markdown += `${card.question}\n\n`;
      markdown += `**Answer:**\n\n`;
      markdown += `${card.answer}\n\n`;
      markdown += `---\n\n`;
    });
  } else {
    markdown += `## Flashcards\n\n`;
    markdown += `*No cards in this deck yet.*\n\n`;
  }

  // Add footer
  markdown += `\n---\n\n`;
  markdown += `*Generated from Flashy Cardy on ${new Date().toLocaleDateString()}*\n`;

  return {
    success: true,
    markdown,
    filename: `${deck.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`,
  };
}

