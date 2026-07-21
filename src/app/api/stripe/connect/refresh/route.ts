import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Un lien d'onboarding Stripe expire au bout d'un moment ; cette route en
// régénère un et redirige dessus (c'est le refresh_url passé à l'AccountLink).
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  }

  const utilisateur = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
  });

  if (!utilisateur?.stripeConnectAccountId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/parrainage`);
  }

  const accountLink = await stripe.accountLinks.create({
    account: utilisateur.stripeConnectAccountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/connect/refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/parrainage?connect=retour`,
    type: "account_onboarding",
  });

  return NextResponse.redirect(accountLink.url);
}
