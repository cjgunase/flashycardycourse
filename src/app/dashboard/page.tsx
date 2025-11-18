import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserDecks } from "@/db/queries/decks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateDeckDialog } from "./_components/create-deck-dialog";
import { DeckCard } from "./_components/deck-card";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // Fetch user's decks using query function
  const decks = await getUserDecks(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">My Decks</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {decks.length === 0
                ? "Create your first flashcard deck to get started"
                : `You have ${decks.length} ${decks.length === 1 ? "deck" : "decks"}`}
            </p>
          </div>
          <CreateDeckDialog />
        </div>


        {decks.length === 0 ? (
          // Show message prompting user to create their first deck
          <Card className="border-2 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground">No decks yet</CardTitle>
              <CardDescription className="text-muted-foreground">
                Get started by creating your first flashcard deck. Perfect for studying medical concepts, procedures, and clinical knowledge.
              </CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        ) : (
          // Render a grid of deck cards with confidence sliders
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

