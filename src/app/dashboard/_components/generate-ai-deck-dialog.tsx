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
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Crown, Loader2 } from "lucide-react";
import { generateAIDeckAction } from "../actions";
import type { GenerateAIDeckInput } from "../schemas";
import Link from "next/link";

interface GenerateAIDeckDialogProps {
  hasAiHelper: boolean;
  canCreateMoreDecks: boolean;
  currentDeckCount: number;
  deckLimit: number | null;
}

export function GenerateAIDeckDialog({
  hasAiHelper,
  canCreateMoreDecks,
  currentDeckCount,
  deckLimit,
}: GenerateAIDeckDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);

  const maxLength = 100000; // 100KB
  const characterCount = content.length;
  const isOverLimit = characterCount > maxLength;
  const isAtDeckLimit = !canCreateMoreDecks && deckLimit !== null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setRequiresUpgrade(false);

    const input: GenerateAIDeckInput = {
      content: content,
    };

    try {
      const result = await generateAIDeckAction(input);

      if (result.success) {
        setOpen(false);
        setContent("");
        // Optionally show success message or redirect
      } else {
        setError(result.error || "Failed to generate deck");
        if ("requiresUpgrade" in result && result.requiresUpgrade) {
          setRequiresUpgrade(true);
        }
      }
    } catch (err) {
      console.error("Failed to generate AI deck:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show upgrade prompt if user doesn't have AI helper
  if (!hasAiHelper) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            Generate with AI
            <Crown className="ml-2 h-4 w-4 text-yellow-500" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Pro Feature
            </DialogTitle>
            <DialogDescription>
              AI-powered deck generation is available on the Pro plan.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="rounded-lg bg-primary/5 p-4 space-y-2">
              <h3 className="font-semibold text-lg">Upgrade to Pro for AI Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Generate flashcards automatically from any text
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI follows research-based spaced repetition principles
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Save hours creating study materials
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button asChild>
              <Link href="/pricing">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Show deck limit warning if at limit
  if (isAtDeckLimit) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
            disabled
          >
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            Generate with AI
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
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
              <p className="text-sm text-muted-foreground">
                Create unlimited decks and use AI-powered features.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button asChild>
              <Link href="/pricing">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Show the normal AI generation form for Pro users
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
        >
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Flashcard Deck with AI
            </DialogTitle>
            <DialogDescription>
              Paste any text content (notes, articles, textbook chapters) and AI will create a
              research-based flashcard deck using spaced repetition principles.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="content" className="text-sm font-medium">
                  Content <span className="text-destructive">*</span>
                </label>
                <span
                  className={`text-xs ${
                    isOverLimit ? "text-destructive font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {characterCount.toLocaleString()} / {maxLength.toLocaleString()} characters
                </span>
              </div>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your study material here... (lecture notes, textbook chapters, articles, etc.)"
                className="min-h-[300px] resize-none font-mono text-sm"
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-muted-foreground">
                The AI will analyze your content and create 10-30 flashcards following cognitive
                science principles for effective learning.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 space-y-2">
                <p className="text-sm text-destructive">{error}</p>
                {requiresUpgrade && (
                  <Button size="sm" variant="outline" asChild className="w-full">
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
            <Button type="submit" disabled={isSubmitting || isOverLimit || content.length < 10}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Deck
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

