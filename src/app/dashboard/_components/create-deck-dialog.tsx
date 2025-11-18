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
import { Plus } from "lucide-react";
import { createDeckAction } from "../actions";
import type { CreateDeckInput } from "../schemas";

const CONFIDENCE_LEVELS = {
  1: { label: "Less Confident", description: "Need more practice with this topic", color: "text-orange-600" },
  2: { label: "Medium", description: "Getting comfortable with this topic", color: "text-blue-600" },
  3: { label: "More Confident", description: "Very familiar with this topic", color: "text-green-600" },
};

export function CreateDeckDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState(2);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

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
      }
    } catch (err) {
      console.error("Failed to create deck:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentLevel = CONFIDENCE_LEVELS[confidenceLevel as keyof typeof CONFIDENCE_LEVELS];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" />
          Create Deck
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Deck</DialogTitle>
            <DialogDescription>
              Create a new flashcard deck to organize your study materials. Set your confidence level to track your progress.
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
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
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
      </DialogContent>
    </Dialog>
  );
}

