import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Stripe exige le corps brut (non parsé) pour vérifier la signature.
export async function POST(request: Request) {
  const corpsBrut = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      corpsBrut,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (erreur) {
    console.error("Signature de webhook Stripe invalide :", erreur);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const userId = checkoutSession.metadata?.userId;

        if (checkoutSession.mode === "subscription" && checkoutSession.subscription && userId) {
          const abonnementStripe = await stripe.subscriptions.retrieve(
            checkoutSession.subscription as string
          );
          await synchroniserAbonnement(userId, abonnementStripe);
        }

        if (checkoutSession.mode === "payment" && checkoutSession.payment_intent && userId) {
          await prisma.payment.create({
            data: {
              userId,
              stripePaymentIntentId: checkoutSession.payment_intent as string,
              amount: checkoutSession.amount_total ?? 0,
              currency: checkoutSession.currency ?? "eur",
              status: "SUCCEEDED",
              description: "Paiement unique via Stripe Checkout",
            },
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const abonnementStripe = event.data.object as Stripe.Subscription;
        const userId = await trouverUserIdParCustomerId(abonnementStripe.customer as string);
        if (userId) {
          await synchroniserAbonnement(userId, abonnementStripe);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const abonnementStripe = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: abonnementStripe.id },
          data: { status: "CANCELED" },
        });
        break;
      }

      case "invoice.payment_failed": {
        const facture = event.data.object as Stripe.Invoice;
        if (facture.subscription) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: facture.subscription as string },
            data: { status: "PAST_DUE" },
          });
        }
        break;
      }

      default:
        // Événement non géré : ignoré volontairement
        break;
    }

    return NextResponse.json({ received: true });
  } catch (erreur) {
    console.error("Erreur lors du traitement du webhook Stripe :", erreur);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function trouverUserIdParCustomerId(stripeCustomerId: string) {
  const utilisateur = await prisma.user.findUnique({ where: { stripeCustomerId } });
  return utilisateur?.id ?? null;
}

const STATUTS_STRIPE_VERS_PRISMA: Record<string, string> = {
  trialing: "TRIALING",
  active: "ACTIVE",
  past_due: "PAST_DUE",
  canceled: "CANCELED",
  unpaid: "UNPAID",
  incomplete: "INCOMPLETE",
  incomplete_expired: "INCOMPLETE_EXPIRED",
};

async function synchroniserAbonnement(userId: string, abonnementStripe: Stripe.Subscription) {
  const statut = STATUTS_STRIPE_VERS_PRISMA[abonnementStripe.status] ?? "INCOMPLETE";

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: abonnementStripe.id },
    create: {
      userId,
      stripeSubscriptionId: abonnementStripe.id,
      stripePriceId: abonnementStripe.items.data[0]?.price.id ?? "",
      stripeCustomerId: abonnementStripe.customer as string,
      status: statut as any,
      currentPeriodStart: new Date(abonnementStripe.current_period_start * 1000),
      currentPeriodEnd: new Date(abonnementStripe.current_period_end * 1000),
      cancelAtPeriodEnd: abonnementStripe.cancel_at_period_end,
    },
    update: {
      status: statut as any,
      currentPeriodStart: new Date(abonnementStripe.current_period_start * 1000),
      currentPeriodEnd: new Date(abonnementStripe.current_period_end * 1000),
      cancelAtPeriodEnd: abonnementStripe.cancel_at_period_end,
      stripePriceId: abonnementStripe.items.data[0]?.price.id ?? "",
    },
  });
}
