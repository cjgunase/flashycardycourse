"use client";

import { useState } from "react";
import { Plus, X, Upload } from "lucide-react";
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
import { createCardAction } from "@/app/dashboard/actions";
import type { CreateCardInput } from "@/app/dashboard/schemas";

interface CreateCardDialogProps {
  deckId: number;
  children?: React.ReactNode;
}

export function CreateCardDialog({ deckId, children }: CreateCardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

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

    const form = e.currentTarget; // Store reference before async call
    const formData = new FormData(form);

    const input: CreateCardInput = {
      deckId,
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      image: imageBase64 || undefined,
    };

    try {
      const result = await createCardAction(input);

      if (result.success) {
        setOpen(false);
        form.reset(); // Use the stored reference
        clearImage();
      } else {
        setError(result.error || "Failed to create card");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Failed to create card:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Add Card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Card</DialogTitle>
            <DialogDescription>
              Add a new flashcard to this deck. Enter the question and answer.
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
              {isSubmitting ? "Creating..." : "Create Card"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

