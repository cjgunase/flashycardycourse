"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateCardAction } from "@/app/dashboard/actions";
import type { UpdateCardInput } from "@/app/dashboard/schemas";
import type { Card } from "@/db/queries/cards";

interface EditCardDialogProps {
  card: Card;
  deckId: number;
}

export function EditCardDialog({ card, deckId }: EditCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const input: UpdateCardInput = {
      cardId: card.id,
      deckId,
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
    };

    try {
      const result = await updateCardAction(input);

      if (result.success) {
        setOpen(false);
      } else {
        setError(result.error || "Failed to update card");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Failed to update card:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
            <DialogDescription>
              Update the question and answer for this flashcard.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                name="question"
                placeholder="Enter the question or prompt..."
                required
                rows={3}
                disabled={isSubmitting}
                defaultValue={card.question}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                name="answer"
                placeholder="Enter the answer or explanation..."
                required
                rows={5}
                disabled={isSubmitting}
                defaultValue={card.answer}
              />
            </div>
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

