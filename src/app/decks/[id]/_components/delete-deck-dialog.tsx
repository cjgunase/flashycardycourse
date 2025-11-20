"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { deleteDeckAction } from "@/app/dashboard/actions";
import type { DeleteDeckInput } from "@/app/dashboard/schemas";

interface DeleteDeckDialogProps {
  deckId: number;
  deckTitle: string;
}

export function DeleteDeckDialog({ deckId, deckTitle }: DeleteDeckDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    const input: DeleteDeckInput = {
      deckId,
    };

    try {
      const result = await deleteDeckAction(input);

      if (result.success) {
        setOpen(false);
        // Redirect to dashboard after successful deletion
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to delete deck");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Failed to delete deck:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="text-sm"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span className="hidden xs:inline">Delete Deck</span>
          <span className="xs:hidden">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Deck</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>&quot;{deckTitle}&quot;</strong>?
            </p>
            <p className="text-destructive font-semibold">
              This action cannot be reversed. All cards in this deck will be permanently deleted.
            </p>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? "Deleting..." : "Delete Deck"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

