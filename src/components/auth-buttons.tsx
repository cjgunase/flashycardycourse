"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

export function AuthButtons() {
  const { openSignIn, openSignUp } = useClerk();

  return (
    <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 w-full xs:w-auto px-4 xs:px-0">
      <Button 
        variant="outline" 
        onClick={() => openSignIn()}
        className="w-full xs:w-auto min-h-[44px]"
      >
        Sign In
      </Button>

      <Button 
        onClick={() => openSignUp()}
        className="w-full xs:w-auto min-h-[44px]"
      >
        Sign Up
      </Button>
    </div>
  );
}

