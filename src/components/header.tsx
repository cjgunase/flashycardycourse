"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useClerk } from "@clerk/nextjs";
import { User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const { user, isSignedIn } = useUser();
  const { openSignIn, openSignUp, signOut } = useClerk();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-800 dark:border-zinc-800 bg-white/80 dark:bg-black/50 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          FlashyDoc
        </Link>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                Dashboard
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                Pricing
              </Link>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full border-zinc-700 bg-transparent hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/pricing"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                Pricing
              </Link>
              <ThemeToggle />
              <Button
                variant="outline"
                onClick={() => openSignIn()}
                className="border-zinc-700 bg-transparent hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
              >
                Sign In
              </Button>
              <Button
                onClick={() => openSignUp()}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

