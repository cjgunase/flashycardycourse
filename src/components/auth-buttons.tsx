"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

export function AuthButtons() {
  const { openSignIn, openSignUp } = useClerk();

  return (
    <div className="flex gap-4">
      <Button variant="outline" onClick={() => openSignIn()}>
        Sign In
      </Button>

      <Button onClick={() => openSignUp()}>Sign Up</Button>
    </div>
  );
}

