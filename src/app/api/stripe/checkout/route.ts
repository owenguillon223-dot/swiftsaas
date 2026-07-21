import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Crée une session Stripe Checkout pour un abonnement ou un paiement unique.
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { priceId, mode = "subscription" } = await request.json();

  if (!priceId) {
    return NextResponse.json({ error: "priceId manquant" }, { status: 400 });
  }

  const utilisateur = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!utilisateur) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Récupère ou crée le client Stripe associé à l'utilisateur
  let stripeCustomerId = utilisateur.stripeCustomerId;

  if (!stripeCustomerId) {
    const client = await stripe.customers.create({
      email: utilisateur.email,
      name: utilisateur.name ?? undefined,
      metadata: { userId: utilisateur.id },
    });
    stripeCustomerId = client.id;

    await prisma.user.update({
      where: { id: utilisateur.id },
      data: { stripeCustomerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: mode === "payment" ? "payment" : "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?succes=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?annule=1`,
    metadata: { userId: utilisateur.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
