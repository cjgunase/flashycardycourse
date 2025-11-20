"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Plus, Crown } from "lucide-react";
import { createDeckAction } from "../actions";
import type { CreateDeckInput } from "../schemas";
import Link from "next/link";

const CONFIDENCE_LEVELS = {
  1: { label: "Less Confident", description: "Need more practice with this topic", color: "text-orange-600" },
  2: { label: "Medium", description: "Getting comfortable with this topic", color: "text-blue-600" },
  3: { label: "More Confident", description: "Very familiar with this topic", color: "text-green-600" },
};

interface CreateDeckDialogProps {
  canCreateMoreDecks: boolean;
  currentDeckCount: number;
  deckLimit: number | null;
}

export function CreateDeckDialog({ 
  canCreateMoreDecks, 
  currentDeckCount, 
  deckLimit 
}: CreateDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setRequiresUpgrade(false);

    const form = e.currentTarget; // Store reference before async call
    const formData = new FormData(form);

    const input: CreateDeckInput = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || undefined,
      confidenceLevel: confidenceLevel,
    };

    try {
      const result = await createDeckAction(input);

      if (result.success) {
        setOpen(false);
        // Reset form
        form.reset(); // Use the stored reference
        setConfidenceLevel(2);
      } else {
        setError(result.error || "Failed to create deck");
        // Check if this is an upgrade-related error
        if ('requiresUpgrade' in result && result.requiresUpgrade) {
          setRequiresUpgrade(true);
        }
      }
    } catch (err) {
      console.error("Failed to create deck:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentLevel = CONFIDENCE_LEVELS[confidenceLevel as keyof typeof CONFIDENCE_LEVELS];
  const isAtLimit = !canCreateMoreDecks && deckLimit !== null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          disabled={isAtLimit}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Deck
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        {isAtLimit ? (
          // Show upgrade prompt when limit is reached
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Deck Limit Reached
              </DialogTitle>
              <DialogDescription>
                You&apos;ve reached the free plan limit of {deckLimit} decks.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-6 space-y-4">
              <div className="rounded-lg bg-primary/5 p-4 space-y-2">
                <h3 className="font-semibold text-lg">Upgrade to Pro</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    Create unlimited flashcard decks
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    Access AI-powered study helpers
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-yellow-500" />
                    Advanced spaced repetition features
                  </li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button asChild>
                <Link href="/pricing">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to Pro
                </Link>
              </Button>
            </DialogFooter>
          </>
        ) : (
          // Show normal create deck form
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create New Deck</DialogTitle>
              <DialogDescription>
                Create a new flashcard deck to organize your study materials. Set your confidence level to track your progress.
                {deckLimit && (
                  <span className="block mt-2 text-xs">
                    {currentDeckCount}/{deckLimit} decks used
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Title Input */}
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Cardiology Finals Prep"
                required
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>

            {/* Description Input */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add a brief description of this deck..."
                maxLength={500}
                disabled={isSubmitting}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Confidence Level Slider */}
            <div className="grid gap-4">
              <Label htmlFor="confidence">
                Confidence Level
              </Label>
              <div className="space-y-4">
                <Slider
                  id="confidence"
                  min={1}
                  max={3}
                  step={1}
                  value={[confidenceLevel]}
                  onValueChange={(value) => setConfidenceLevel(value[0])}
                  disabled={isSubmitting}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Less Confident</span>
                  <span>Medium</span>
                  <span>More Confident</span>
                </div>
                <div className={`rounded-lg bg-muted p-3 text-center transition-colors ${currentLevel.color}`}>
                  <p className="font-semibold">{currentLevel.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentLevel.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 space-y-2">
                <p className="text-sm text-destructive">{error}</p>
                {requiresUpgrade && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    asChild
                    className="w-full"
                  >
                    <Link href="/pricing">
                      <Crown className="mr-2 h-4 w-4" />
                      View Upgrade Options
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Deck"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

