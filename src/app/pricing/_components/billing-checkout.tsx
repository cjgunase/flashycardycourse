"use client";

import * as React from "react";
import { SignedIn, ClerkLoaded } from "@clerk/nextjs";
import {
  CheckoutProvider,
  useCheckout,
  PaymentElementProvider,
  PaymentElement,
  usePaymentElement,
  usePlans,
} from "@clerk/nextjs/experimental";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Loader2, CreditCard, AlertCircle } from "lucide-react";

export function BillingCheckout() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        <Sparkles className="h-4 w-4 mr-2" />
        Upgrade to Pro
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Subscribe to Pro</DialogTitle>
            <DialogDescription>
              Complete your subscription to unlock all Pro features
            </DialogDescription>
          </DialogHeader>

          <ClerkLoaded>
            <SignedIn>
              <CheckoutFlow onSuccess={() => setOpen(false)} />
            </SignedIn>
          </ClerkLoaded>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CheckoutFlow({ onSuccess }: { onSuccess: () => void }) {
  const { data: plans, isLoading } = usePlans({ for: "user" });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Find the first paid plan (non-free plan)
  const proPlan = plans?.find(
    (plan) => 
      plan.name.toLowerCase().includes("pro") || 
      (plan.fee && plan.fee.amount > 0)
  );

  if (!proPlan) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <p className="font-semibold mb-2">No plans configured</p>
          <p className="text-sm">
            Please configure your Pro plan in the Clerk Dashboard:
          </p>
          <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
            <li>Go to Clerk Dashboard → Billing</li>
            <li>Connect your Stripe account</li>
            <li>Create a plan with monthly pricing</li>
            <li>Add features: unlimited_decks, ai_helper</li>
          </ol>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <CheckoutProvider for="user" planId={proPlan.id} planPeriod="month">
      <CustomCheckout onSuccess={onSuccess} planName={proPlan.name} />
    </CheckoutProvider>
  );
}

function CustomCheckout({ 
  onSuccess,
  planName 
}: { 
  onSuccess: () => void;
  planName: string;
}) {
  const { checkout } = useCheckout();
  const { status } = checkout;

  if (status === "needs_initialization") {
    return <CheckoutInitialization />;
  }

  return (
    <div className="space-y-6">
      <CheckoutSummary />

      <PaymentElementProvider checkout={checkout}>
        <PaymentSection onSuccess={onSuccess} />
      </PaymentElementProvider>
    </div>
  );
}

function CheckoutInitialization() {
  const { checkout } = useCheckout();
  const { start, fetchStatus, error } = checkout;

  return (
    <div className="space-y-4 py-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.errors?.[0]?.message || "Failed to initialize checkout"}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={start}
          disabled={fetchStatus === "fetching"}
          size="lg"
          className="w-full"
        >
          {fetchStatus === "fetching" ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Initializing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Continue to Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function PaymentSection({ onSuccess }: { onSuccess: () => void }) {
  const { checkout } = useCheckout();
  const { isConfirming, confirm, finalize, error } = checkout;
  const { isFormReady, submit } = usePaymentElement();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormReady || isProcessing) return;
    setIsProcessing(true);

    try {
      // Submit payment form to get payment method
      const { data, error: submitError } = await submit();
      
      // Usually a validation error from stripe that you can display
      if (submitError) {
        console.error("Payment validation error:", submitError);
        setIsProcessing(false);
        return;
      }

      // Confirm checkout with payment method
      await confirm(data);

      // Complete checkout and redirect
      await finalize({
        navigate: () => {
          onSuccess();
          router.refresh(); // Refresh to update user's plan status
          router.push("/dashboard");
        },
      });
    } catch (error) {
      console.error("Payment failed:", error);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Details
        </h3>
        <PaymentElement
          fallback={
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.errors?.[0]?.message || "Payment failed. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!isFormReady || isProcessing || isConfirming}
        size="lg"
        className="w-full"
      >
        {isProcessing || isConfirming ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          "Complete Purchase"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Your payment is securely processed by Stripe. By completing this purchase,
        you agree to our terms of service.
      </p>
    </form>
  );
}

function CheckoutSummary() {
  const { checkout } = useCheckout();
  const { plan, totals } = checkout;

  if (!plan) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-muted/50 p-6">
      <h3 className="text-sm font-medium mb-4">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Plan</span>
          <span className="font-semibold">{plan.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Billing Period</span>
          <span className="text-sm">Monthly</span>
        </div>
        <div className="pt-4 mt-4 border-t flex justify-between items-center">
          <span className="font-semibold">Total Due Today</span>
          <span className="text-2xl font-bold">
            {totals?.totalDueNow?.currencySymbol}
            {totals?.totalDueNow?.amountFormatted}
          </span>
        </div>
      </div>
    </div>
  );
}

