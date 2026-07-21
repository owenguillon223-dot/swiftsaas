import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY manquant dans les variables d'environnement");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

// Plans disponibles - à adapter selon vos produits Stripe
export const PLANS = {
  mensuel: {
    name: "Mensuel",
    priceId: process.env.STRIPE_PRICE_ID_MENSUEL!,
    interval: "month",
  },
  annuel: {
    name: "Annuel",
    priceId: process.env.STRIPE_PRICE_ID_ANNUEL!,
    interval: "year",
  },
} as const;
