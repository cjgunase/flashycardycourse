import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getDeckById } from "@/db/queries/decks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { CreateCardDialog } from "./_components/create-card-dialog";
import { CardItem } from "./_components/card-item";
import { DownloadDeckButton } from "./_components/download-deck-button";
import { DeleteDeckDialog } from "./_components/delete-deck-dialog";

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { id } = await params;
  const deckId = parseInt(id);
  if (isNaN(deckId)) {
    notFound();
  }

  // Fetch deck with cards using query function
  const deck = await getDeckById(deckId, userId);

  if (!deck) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Decks
            </Link>
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                {deck.title}
              </h1>
              {deck.description && (
                <p className="mt-2 text-lg text-muted-foreground">
                  {deck.description}
                </p>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                {deck.cards?.length || 0}{" "}
                {deck.cards?.length === 1 ? "card" : "cards"}
              </p>
            </div>

            <div className="flex gap-2">
              <DeleteDeckDialog deckId={deckId} deckTitle={deck.title} />
              <DownloadDeckButton deckId={deckId} />
              <CreateCardDialog deckId={deckId} />
            </div>
          </div>
        </div>

        {/* Cards Section */}
        {!deck.cards || deck.cards.length === 0 ? (
          <Card className="border-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">
                No cards yet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Start adding flashcards to this deck to begin studying.
              </p>
              <CreateCardDialog deckId={deckId}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Card
                </Button>
              </CreateCardDialog>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {deck.cards.map((card, index) => (
              <CardItem 
                key={card.id} 
                card={card} 
                deckId={deckId} 
                cardNumber={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

