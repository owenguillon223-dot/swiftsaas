import Stripe from "stripe";

let stripeClient: Stripe | null = null;

/**
 * Lazily constructs and memoizes the Stripe client. Reading env vars at call
 * time (not module load) means importing this file never throws during
 * `next build`, even when STRIPE_SECRET_KEY isn't set yet.
 */
export function getStripeClient(): Stripe {
  if (stripeClient) return stripeClient;

  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  stripeClient = new Stripe(apiKey);
  return stripeClient;
}
