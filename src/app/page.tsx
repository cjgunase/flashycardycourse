import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthButtons } from "@/components/auth-buttons";

export default async function Home() {
  const { userId } = await auth();

  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  // If user is not logged in, show the homepage
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-6xl font-bold text-foreground">
          FlashyDoc
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          High-yield flashcards for confident clinical practice.
        </p>
        <p className="mb-8 text-muted-foreground">
          Sign in or sign up to get started with your flashcards.
        </p>
        <AuthButtons />
      </main>
    </div>
  );
}
