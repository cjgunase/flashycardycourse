import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  // Redirect to home if not authenticated
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-50">
            Welcome back, {user?.firstName || "there"}! 👋
          </h1>
          <p className="mt-2 text-lg text-zinc-400">
            Ready to learn with flashcards?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-zinc-50">Total Decks</CardTitle>
              <CardDescription>Flashcard collections</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-zinc-50">0</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-zinc-50">Total Cards</CardTitle>
              <CardDescription>Flashcards created</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-zinc-50">0</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-zinc-50">Study Streak</CardTitle>
              <CardDescription>Days in a row</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-zinc-50">0</p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-zinc-50">Cards Studied</CardTitle>
              <CardDescription>This week</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-zinc-50">0</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Decks */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-zinc-50">Recent Decks</CardTitle>
              <CardDescription>
                Your most recently accessed flashcard decks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-zinc-500">No decks yet</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Create your first deck to get started
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Study Activity */}
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-zinc-50">Study Activity</CardTitle>
              <CardDescription>Your learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-zinc-500">No activity yet</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Start studying to track your progress
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card className="border-zinc-800 bg-zinc-950">
            <CardHeader>
              <CardTitle className="text-zinc-50">Quick Actions</CardTitle>
              <CardDescription>Get started with your learning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <button className="rounded-lg bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-zinc-200">
                  Create New Deck
                </button>
                <button className="rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-3 font-medium text-zinc-50 transition-colors hover:bg-zinc-800">
                  Browse Templates
                </button>
                <button className="rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-3 font-medium text-zinc-50 transition-colors hover:bg-zinc-800">
                  Import Deck
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

