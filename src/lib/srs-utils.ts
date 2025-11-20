import type { Card } from "@/db/queries/cards";

/**
 * Confidence level type representing the three levels of confidence
 */
export type ConfidenceLevel = 1 | 2 | 3;

/**
 * Confidence level labels and their corresponding weights for card selection
 */
export const CONFIDENCE_CONFIG = {
    1: { label: "Less Confident", weight: 6, difficultyMultiplier: 1.1 },
    2: { label: "Medium", weight: 3, difficultyMultiplier: 1.3 },
    3: { label: "More Confident", weight: 1, difficultyMultiplier: 1.8 },
} as const;

/**
 * Base growth factor for spaced repetition
 */
const BASE_GROWTH = 2.0;

/**
 * Minimum interval in days
 */
const MIN_INTERVAL_DAYS = 1;

/**
 * Get the weight for a card based on its confidence level
 * Less confident cards get higher weights (appear more frequently)
 */
export function getConfidenceWeight(confidenceLevel: ConfidenceLevel): number {
    return CONFIDENCE_CONFIG[confidenceLevel].weight;
}

/**
 * Calculate the next review date based on the SRS algorithm
 * 
 * @param currentInterval - Current interval in days (0 for new cards)
 * @param confidenceRating - User's confidence rating (1-3)
 * @returns Object containing new interval (days) and next due date
 */
export function calculateNextReview(
    currentInterval: number,
    confidenceRating: ConfidenceLevel
): { intervalDays: number; nextDueAt: Date } {
    const diffMultiplier = CONFIDENCE_CONFIG[confidenceRating].difficultyMultiplier;

    // For first review, start with base interval
    const baseInterval = currentInterval === 0 ? 1 : currentInterval;

    // Calculate new interval: interval * base_growth * difficulty_multiplier
    let newInterval = baseInterval * BASE_GROWTH * diffMultiplier;

    // Clamp minimum interval
    if (newInterval < MIN_INTERVAL_DAYS) {
        newInterval = MIN_INTERVAL_DAYS;
    }

    // Round to whole days
    const intervalDays = Math.round(newInterval);

    // Calculate next due date
    const nextDueAt = new Date();
    nextDueAt.setDate(nextDueAt.getDate() + intervalDays);

    return { intervalDays, nextDueAt };
}

/**
 * Weighted random selection algorithm
 * Selects N items from an array based on their weights
 * 
 * @param items - Array of items to select from
 * @param weights - Array of weights corresponding to each item
 * @param count - Number of items to select
 * @returns Selected items
 */
export function weightedRandomSelect<T>(
    items: T[],
    weights: number[],
    count: number
): T[] {
    if (items.length === 0) return [];
    if (items.length !== weights.length) {
        throw new Error("Items and weights arrays must have the same length");
    }

    // Don't select more items than available
    const selectCount = Math.min(count, items.length);

    // Calculate total weight
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    // Normalize weights into probabilities
    const probabilities = weights.map(w => w / totalWeight);

    // Create cumulative probability distribution
    const cumulativeProbabilities: number[] = [];
    let cumSum = 0;
    for (const prob of probabilities) {
        cumSum += prob;
        cumulativeProbabilities.push(cumSum);
    }

    // Select items without replacement
    const selected: T[] = [];
    const selectedIndices = new Set<number>();

    while (selected.length < selectCount) {
        const random = Math.random();

        // Find the index where random value falls in cumulative distribution
        let selectedIndex = cumulativeProbabilities.findIndex(
            (cumProb, idx) => !selectedIndices.has(idx) && random <= cumProb
        );

        // Fallback: if all weighted selections are used, pick from remaining
        if (selectedIndex === -1) {
            const remainingIndices = items
                .map((_, idx) => idx)
                .filter(idx => !selectedIndices.has(idx));
            if (remainingIndices.length > 0) {
                selectedIndex = remainingIndices[0];
            } else {
                break;
            }
        }

        if (!selectedIndices.has(selectedIndex)) {
            selectedIndices.add(selectedIndex);
            selected.push(items[selectedIndex]);
        }
    }

    return selected;
}

/**
 * Get cards that are due for review and sort them by weighted random selection
 * 
 * @param cards - All cards in the deck
 * @returns Cards that are due, weighted by confidence level
 */
export function selectCardsForReview(cards: Card[]): Card[] {
    // Filter cards that are due (nextDueAt <= now or null)
    const now = new Date();
    const dueCards = cards.filter(card => {
        if (!card.nextDueAt) return true; // New cards are always due
        return new Date(card.nextDueAt) <= now;
    });

    if (dueCards.length === 0) return [];

    // Get weights based on confidence levels
    const weights = dueCards.map(card =>
        getConfidenceWeight((card.confidenceLevel || 2) as ConfidenceLevel)
    );

    // Use weighted random selection to order all due cards
    // This ensures less confident cards appear earlier
    return weightedRandomSelect(dueCards, weights, dueCards.length);
}

/**
 * Calculate the current interval in days from the last review
 * 
 * @param lastReviewedAt - Last review timestamp (null for new cards)
 * @returns Interval in days since last review (0 for new cards)
 */
export function getCurrentInterval(lastReviewedAt: Date | null): number {
    if (!lastReviewedAt) return 0;

    const now = new Date();
    const lastReview = new Date(lastReviewedAt);
    const diffMs = now.getTime() - lastReview.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
}
