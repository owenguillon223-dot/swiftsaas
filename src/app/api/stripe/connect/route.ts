import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Crée (ou réutilise) le compte Stripe Connect Express du parrain et renvoie
// un lien d'onboarding hébergé par Stripe (KYC, coordonnées bancaires).
export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const utilisateur = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
  });
  if (!utilisateur) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  let accountId = utilisateur.stripeConnectAccountId;

  if (!accountId) {
    // France par défaut : le produit est aujourd'hui exclusivement
    // francophone. À internationaliser si besoin (sélecteur de pays côté UI).
    const account = await stripe.accounts.create({
      type: "express",
      country: "FR",
      email: utilisateur.email,
      capabilities: { transfers: { requested: true } },
      business_type: "individual",
      metadata: { userId: utilisateur.id },
    });
    accountId = account.id;

    await prisma.user.update({
      where: { id: utilisateur.id },
      data: { stripeConnectAccountId: accountId },
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/connect/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/parrainage?connect=retour`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
