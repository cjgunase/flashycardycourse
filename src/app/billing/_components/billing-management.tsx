"use client";

import { SignedIn, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { SubscriptionDetailsButton } from "@clerk/nextjs/experimental";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Settings, Loader2 } from "lucide-react";

interface BillingManagementProps {
  isProUser: boolean;
}

export function BillingManagement({ isProUser }: BillingManagementProps) {
  return (
    <div className="space-y-6">
      {!isProUser && (
        <Alert className="border-primary/50 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertTitle>Upgrade to Pro</AlertTitle>
          <AlertDescription>
            Unlock unlimited decks and AI-powered features to supercharge your learning.
          </AlertDescription>
        </Alert>
      )}

      <ClerkLoading>
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignedIn>
          {isProUser ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage your Pro subscription, update payment methods, or cancel your
                subscription.
              </p>
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
                  Manage Subscription
                </Button>
              </SubscriptionDetailsButton>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button asChild size="lg">
                <a href="/pricing">View All Plans</a>
              </Button>
            </div>
          )}
        </SignedIn>
      </ClerkLoaded>
    </div>
  );
}

