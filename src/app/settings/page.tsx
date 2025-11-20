import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, User as UserIcon, CreditCard, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { SubscriptionManagement } from "./_components/subscription-management";
import { AccountManagementButton } from "./_components/account-management-button";

export default async function SettingsPage() {
  const { userId, has } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();
  const isProUser = await has({ plan: "pro" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            asChild
            variant="ghost"
            className="mb-4 text-muted-foreground hover:text-foreground -ml-2"
          >
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account, subscription, and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Current Plan Card */}
          <Card className="border-2">
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
              <div className="space-y-3">
                {/* Features List */}
                {isProUser ? (
                  <>
                    <div className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Unlimited Decks</p>
                        <p className="text-muted-foreground">
                          Create as many flashcard decks as you need
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">AI Helper</p>
                        <p className="text-muted-foreground">
                          Generate flashcards with AI assistance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Priority Support</p>
                        <p className="text-muted-foreground">
                          Get help faster with priority support
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Up to 3 Decks</p>
                        <p className="text-muted-foreground">
                          Create up to 3 flashcard decks
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Basic Features</p>
                        <p className="text-muted-foreground">
                          Access to spaced repetition and progress tracking
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!isProUser && (
                <div className="mt-6 pt-6 border-t">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/pricing" className="flex items-center justify-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Management Card (Pro Users Only) */}
          {isProUser && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Management
                </CardTitle>
                <CardDescription>
                  Manage your subscription, update payment methods, view billing history, or cancel your subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriptionManagement />
              </CardContent>
            </Card>
          )}

          {/* Account Information Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* User Info */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <UserIcon className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">Name</p>
                      <p className="text-muted-foreground break-words">
                        {user?.fullName || user?.firstName || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground break-words">
                        {user?.primaryEmailAddress?.emailAddress || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Sparkles className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">Member Since</p>
                      <p className="text-muted-foreground">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t space-y-3">
                  <p className="text-sm text-muted-foreground">
                    To update your profile information, change your password, or manage security settings, click the button below.
                  </p>
                  <AccountManagementButton />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

