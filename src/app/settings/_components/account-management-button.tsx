"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";

export function AccountManagementButton() {
  const { openUserProfile } = useClerk();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => openUserProfile()}
    >
      <UserCog className="h-4 w-4 mr-2" />
      Manage Account Details
    </Button>
  );
}

