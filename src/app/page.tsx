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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <main className="flex flex-col items-center justify-center text-center max-w-2xl">
        <h1 className="mb-4 text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
          FlashyDoc
        </h1>
        <p className="mb-6 sm:mb-8 text-lg sm:text-xl text-muted-foreground px-4">
          High-yield flashcards for confident clinical practice.
        </p>
        <p className="mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground px-4">
          Sign in or sign up to get started with your flashcards.
        </p>
        <AuthButtons />
      </main>
    </div>
  );
}
