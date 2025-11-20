"use client";

import { usePlans } from "@clerk/nextjs/experimental";
import { ClerkLoaded, useAuth, useClerk } from "@clerk/nextjs";
import { CheckIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BillingCheckout } from "./billing-checkout";

interface PricingPlansProps {
  isProUser: boolean;
}

export function PricingPlans({ isProUser }: PricingPlansProps) {
  const { userId } = useAuth();
  const { openSignUp } = useClerk();
  const { data: plans, isLoading } = usePlans({ for: "user" });

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Find free and pro plans
  const freePlan = plans?.find((p) => p.fee?.amount === 0);
  const proPlan = plans?.find(
    (p) =>
      p.name.toLowerCase().includes("pro") ||
      (p.fee && p.fee.amount > 0)
  );

  if (!proPlan) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertDescription>
          <p className="font-semibold mb-2">Plans not configured</p>
          <p className="text-sm">
            Please set up your pricing plans in Clerk Dashboard → Billing
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  const isAuthenticated = !!userId;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
      {/* Free Plan */}
      <Card className="relative flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl">{freePlan?.name || "Free"}</CardTitle>
          <CardDescription>Perfect for getting started</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted-foreground ml-2">/ forever</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Up to 3 flashcard decks</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Unlimited cards per deck</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Spaced repetition algorithm</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Progress tracking</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          {!isAuthenticated ? (
            <Button variant="outline" className="w-full" onClick={() => openSignUp()}>
              Get Started Free
            </Button>
          ) : !isProUser ? (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <Button variant="outline" className="w-full" asChild>
              <a href="/dashboard">Go to Dashboard</a>
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Pro Plan */}
      <Card className="relative flex flex-col border-primary shadow-lg pt-6">
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="bg-primary text-primary-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
            Most Popular
          </span>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{proPlan.name}</CardTitle>
          <CardDescription>For serious learners who want it all</CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">
              {proPlan.fee?.currencySymbol}
              {proPlan.fee?.amountFormatted}
            </span>
            <span className="text-muted-foreground ml-2">/ month</span>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="font-semibold">Unlimited flashcard decks</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Unlimited cards per deck</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Spaced repetition algorithm</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Progress tracking</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="font-semibold">AI-powered flashcard generation</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="font-semibold">Smart study recommendations</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span>Priority support</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          {!isAuthenticated ? (
            <Button className="w-full" onClick={() => openSignUp()}>
              Start Free Trial
            </Button>
          ) : isProUser ? (
            <Button className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <BillingCheckout />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

