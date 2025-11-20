"use client";

import { SignedIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { SubscriptionDetailsButton } from "@clerk/nextjs/experimental";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Settings, Loader2, AlertTriangle } from "lucide-react";

export function SubscriptionManagement() {
  return (
    <div className="space-y-6">
      <Alert className="border-amber-500/50 bg-amber-500/5">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertTitle>Subscription Actions</AlertTitle>
        <AlertDescription>
          <p className="mb-2">
            Click the button below to access your subscription dashboard where you can:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 ml-2">
            <li>Update your payment method</li>
            <li>View billing history and invoices</li>
            <li>Change your billing cycle (monthly/annual)</li>
            <li>Cancel your subscription (you&apos;ll retain access until the end of your billing period)</li>
          </ul>
        </AlertDescription>
      </Alert>

      <ClerkLoading>
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignedIn>
          <div className="space-y-4">
            <SubscriptionDetailsButton
              subscriptionDetailsProps={{
                appearance: {
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-sm border rounded-lg",
                    formButtonPrimary:
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                  },
                },
              }}
            >
              <Button className="w-full" size="lg">
                <Settings className="h-4 w-4 mr-2" />
                Open Subscription Dashboard
              </Button>
            </SubscriptionDetailsButton>

            <p className="text-xs text-center text-muted-foreground">
              All subscription changes are managed securely through Clerk and Stripe
            </p>
          </div>
        </SignedIn>
      </ClerkLoaded>
    </div>
  );
}

