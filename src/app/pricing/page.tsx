import { auth } from "@clerk/nextjs/server";
import { PricingPlans } from "./_components/pricing-plans";

export default async function PricingPage() {
  const { userId, has } = await auth();

  // Allow unauthenticated users to view pricing
  // Check Pro status only if user is logged in
  const isProUser = userId ? await has({ plan: "pro" }) : false;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Choose the plan that&apos;s right for you. Upgrade or downgrade at any
            time.
          </p>
        </div>

        {/* Pricing Cards */}
        <PricingPlans isProUser={isProUser} />

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-16 max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can cancel your Pro subscription at any time. You&apos;ll
                continue to have access to Pro features until the end of your
                billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What happens to my decks if I downgrade?
              </h3>
              <p className="text-muted-foreground">
                If you have more than 3 decks when you downgrade to the Free
                plan, you&apos;ll still be able to view all your decks. However,
                you won&apos;t be able to create new decks until you delete some or
                upgrade back to Pro.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How does the AI helper work?</h3>
              <p className="text-muted-foreground">
                Our AI helper can automatically generate flashcards from your
                notes or study materials, suggest optimal study times, and
                provide personalized learning recommendations based on your
                performance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit cards through Stripe, our secure
                payment processor. Your payment information is encrypted and
                never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

