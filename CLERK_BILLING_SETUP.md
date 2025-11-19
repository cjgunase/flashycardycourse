# Clerk Billing Setup Guide

## 🚨 Important: Complete This Setup Before Testing Subscriptions

The "Plan not found" error occurs because the Pro plan needs to be created in your Clerk Dashboard. Follow these steps:

## Step 1: Access Clerk Dashboard

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your project
3. Navigate to **Billing** section in the left sidebar

## Step 2: Connect Stripe

1. Click **Connect Stripe Account**
2. Choose your environment:
   - **Development**: Use Stripe test mode
   - **Production**: Use live Stripe account
3. Complete the Stripe OAuth connection

⚠️ **Important**: You must use separate Stripe accounts for development and production environments.

## Step 3: Create the Pro Plan

1. Click **Create Plan** button
2. Fill in the plan details:

   ```
   Plan ID: pro
   Plan Name: Pro
   Description: Unlimited decks and AI-powered features
   ```

3. **Set Monthly Pricing**:
   - Billing Period: `Monthly`
   - Price: `$9.99` (or your preferred amount)
   - Currency: `USD`

4. **Mark as Publicly Available**: ✅ Enable this so users can subscribe

## Step 4: Add Features to the Plan

Features control what functionality users get with this plan. Add these two features:

### Feature 1: Unlimited Decks
```
Feature ID: unlimited_decks
Feature Name: Unlimited Decks
Description: Create unlimited flashcard decks
```

### Feature 2: AI Helper
```
Feature ID: ai_helper
Feature Name: AI Helper
Description: Access to AI-powered flashcard generation
```

## Step 5: Verify Configuration

Your plan configuration should look like this:

```
Plan: pro
├── Billing Period: Monthly
├── Price: $9.99 USD / month
├── Status: Publicly Available ✅
└── Features:
    ├── unlimited_decks ✅
    └── ai_helper ✅
```

## Step 6: Update Free Plan (Optional but Recommended)

1. Create or update the free plan:
   ```
   Plan ID: free_user
   Plan Name: Free
   Price: $0
   ```

2. Add free plan features:
   ```
   Feature ID: 3_deck_limit
   Feature Name: 3 Deck Limit
   Description: Limited to 3 decks
   ```

## Step 7: Test the Subscription Flow

### Using Stripe Test Cards

When testing in development mode, use these test cards:

| Card Number         | Scenario          |
|---------------------|-------------------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0000 0000 0069 | Expired card      |

- Use any future expiration date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

### Testing Steps

1. Navigate to `/pricing` page
2. Click **Upgrade to Pro** button
3. Clerk will open the checkout form
4. Enter test card details
5. Complete the subscription
6. Verify:
   - User plan changes to "pro"
   - `unlimited_decks` feature is available
   - `ai_helper` feature is available

## Troubleshooting

### "Plan not found" Error

**Cause**: The Pro plan is not configured in Clerk Dashboard

**Solution**: Complete Steps 3-4 above to create the plan

### Wrong Amount Displayed

**Cause**: The price in your Clerk plan doesn't match the displayed price

**Solution**: 
- Update the plan price in Clerk Dashboard
- The checkout will show the **actual price from Clerk**, not the $9.99 shown on the pricing page
- Update the pricing page to match your Clerk plan price

### Stripe Connection Issues

**Cause**: Stripe account already connected to another platform, or wrong environment

**Solution**:
- Use a fresh Stripe account
- Ensure dev environment uses Stripe test mode
- Ensure prod environment uses Stripe live mode

## Current Implementation

### What's Configured

✅ **Monthly billing only** - No annual plans (as requested)
✅ **Plan ID**: `pro`
✅ **Features**: `unlimited_decks`, `ai_helper`
✅ **Error handling**: Shows helpful setup instructions if plan is missing
✅ **Stripe integration**: Ready to process payments once configured

### What Happens When User Clicks "Upgrade to Pro"

1. The `useCheckout` hook initializes with:
   - `planId: "pro"`
   - `planPeriod: "month"`
   - `for: "user"`

2. Clerk fetches the plan details from your dashboard

3. If plan exists: Opens Stripe checkout form with **actual price**

4. If plan missing: Shows error dialog with setup instructions

## Environment Variables

Ensure these are set in your `.env.local`:

```bash
# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## Webhook Setup (Optional but Recommended)

Set up webhooks to track subscription events:

1. In Clerk Dashboard, go to **Webhooks**
2. Create endpoint: `https://yourdomain.com/api/webhooks/clerk-billing`
3. Subscribe to events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.deleted`
   - `payment.successful`
   - `payment.failed`

## Next Steps

1. ✅ Complete the setup steps above
2. ✅ Test with Stripe test cards
3. ✅ Verify features are working correctly
4. ✅ Test subscription management at `/billing`
5. 🚀 Switch to production when ready

## Support Resources

- [Clerk Billing Docs](https://clerk.com/docs/guides/billing/overview)
- [Clerk B2C SaaS Guide](https://clerk.com/docs/guides/billing/for-b2c)
- [Stripe Testing Cards](https://docs.stripe.com/testing)

---

**Need Help?** Check the error dialog that appears when clicking "Upgrade to Pro" - it shows exactly what needs to be configured in your Clerk Dashboard.

