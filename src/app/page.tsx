import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <main className="flex w-full max-w-4xl flex-col items-center justify-center px-6 py-32 text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="mb-6 text-6xl font-bold leading-tight tracking-tight text-zinc-50">
            Learn Smarter with
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              FlashyCardyCourse
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-400">
            Master any subject with intelligent flashcards. Create, study, and
            track your progress with the most intuitive learning platform.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <SignedOut>
            <Link
              href="/sign-up"
              className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-105 hover:bg-zinc-200"
            >
              Get Started Free
            </Link>
            <Link
              href="/sign-in"
              className="rounded-lg border-2 border-zinc-700 bg-transparent px-8 py-4 text-lg font-semibold text-zinc-50 transition-all hover:border-zinc-500 hover:bg-zinc-900"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-105 hover:bg-zinc-200"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-4 text-4xl">🎯</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-50">
              Smart Learning
            </h3>
            <p className="text-zinc-400">
              Adaptive algorithms help you focus on what matters most
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-4 text-4xl">📊</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-50">
              Track Progress
            </h3>
            <p className="text-zinc-400">
              Detailed analytics show your learning journey
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="mb-4 text-4xl">⚡</div>
            <h3 className="mb-2 text-xl font-semibold text-zinc-50">
              Study Anywhere
            </h3>
            <p className="text-zinc-400">
              Access your decks on any device, anytime
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
