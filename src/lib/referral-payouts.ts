import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Verse par virement Stripe Connect (Transfer) toutes les récompenses de
// parrainage en attente d'un parrain, dès que son compte Connect est prêt à
// recevoir des paiements. Appelé après la création d'une récompense et après
// chaque webhook account.updated confirmant l'activation d'un compte.
export async function verserRecompensesEnAttente(referrerId: string): Promise<void> {
  const parrain = await prisma.user.findUnique({ where: { id: referrerId } });
  if (!parrain?.stripeConnectAccountId || !parrain.stripeConnectPayoutsEnabled) {
    return;
  }

  const recompenses = await prisma.referralReward.findMany({
    where: { referrerId, status: "PENDING" },
  });

  for (const recompense of recompenses) {
    try {
      const transfer = await stripe.transfers.create({
        amount: recompense.amountCents,
        currency: recompense.currency,
        destination: parrain.stripeConnectAccountId,
        transfer_group: `referral_${recompense.id}`,
      });

      await prisma.referralReward.update({
        where: { id: recompense.id },
        data: { status: "PAID", stripeTransferId: transfer.id },
      });
    } catch (erreur) {
      console.error(
        `[parrainage] Échec du virement pour la récompense ${recompense.id} (parrain ${referrerId}) :`,
        erreur
      );
    }
  }
}
