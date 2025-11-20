import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import { BillingManagement } from "./_components/billing-management";

export default async function BillingPage() {
  const { userId, has } = await auth();

  if (!userId) {
    redirect("/");
  }

  const isProUser = await has({ plan: "pro" });

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isProUser ? (
              <>
                <Sparkles className="h-5 w-5 text-primary" />
                Pro Plan
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                Free Plan
              </>
            )}
          </CardTitle>
          <CardDescription>
            {isProUser
              ? "You have access to all Pro features"
              : "You're currently on the Free plan"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isProUser ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Unlimited Decks</p>
                  <p className="text-muted-foreground">
                    Create as many flashcard decks as you need
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">AI Helper</p>
                  <p className="text-muted-foreground">
                    Generate flashcards with AI assistance
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Priority Support</p>
                  <p className="text-muted-foreground">
                    Get help faster with priority support
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Up to 3 Decks</p>
                  <p className="text-muted-foreground">
                    Create up to 3 flashcard decks
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Basic Features</p>
                  <p className="text-muted-foreground">
                    Access to spaced repetition and progress tracking
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Management */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isProUser ? "Manage Subscription" : "Upgrade to Pro"}
          </CardTitle>
          <CardDescription>
            {isProUser
              ? "Manage your subscription, update payment methods, and view billing history"
              : "Subscribe to Pro and get access to all premium features"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BillingManagement isProUser={isProUser} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <a href="/dashboard">Back to Dashboard</a>
        </Button>
      </div>
    </div>
  );
}

