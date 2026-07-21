import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Crée une session du portail client Stripe (gestion abonnement, factures, moyens de paiement).
export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const utilisateur = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
  });

  if (!utilisateur?.stripeCustomerId) {
    return NextResponse.json(
      { error: "Aucun client Stripe associé à ce compte" },
      { status: 400 }
    );
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: utilisateur.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  return NextResponse.json({ url: portalSession.url });
}
