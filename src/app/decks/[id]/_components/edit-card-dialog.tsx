"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { updateCardAction } from "@/app/dashboard/actions";
import type { UpdateCardInput } from "@/app/dashboard/schemas";
import type { Card } from "@/db/queries/cards";

const PROFICIENCY_LEVELS = {
  1: { label: "Beginner", color: "text-orange-600 dark:text-orange-400" },
  2: { label: "Intermediate", color: "text-blue-600 dark:text-blue-400" },
  3: { label: "Advanced", color: "text-green-600 dark:text-green-400" },
};

interface EditCardDialogProps {
  card: Card;
  deckId: number;
}

export function EditCardDialog({ card, deckId }: EditCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(card.image || null);
  const [imageBase64, setImageBase64] = useState<string | null>(card.image || null);
  const [confidenceLevel, setConfidenceLevel] = useState(card.confidenceLevel || 2);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setError("Please select a JPEG or PNG image file");
      return;
    }

    // Validate file size (2.5MB)
    if (file.size > 2.5 * 1024 * 1024) {
      setError("Image must be smaller than 2.5MB");
      return;
    }

    setError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setImagePreview(null);
    setImageBase64(null);
  }

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
      confidenceLevel: confidenceLevel,
      image: imageBase64 || undefined,
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

  const currentLevel = PROFICIENCY_LEVELS[confidenceLevel as keyof typeof PROFICIENCY_LEVELS];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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

            <div className="grid gap-2">
              <Label htmlFor="image">Image (Optional)</Label>
              <div className="space-y-2">
                {!imagePreview ? (
                  <div className="relative">
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a JPEG or PNG image (max 2.5MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative w-full border rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto max-h-48 object-contain"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={clearImage}
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confidence">Proficiency Level</Label>
              <div className="flex items-center gap-3">
                <Slider
                  min={1}
                  max={3}
                  step={1}
                  value={[confidenceLevel]}
                  onValueChange={(value) => setConfidenceLevel(value[0])}
                  disabled={isSubmitting}
                  className="max-w-32"
                />
                <span className={`text-xs font-semibold ${currentLevel.color} whitespace-nowrap`}>
                  {currentLevel.label}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

