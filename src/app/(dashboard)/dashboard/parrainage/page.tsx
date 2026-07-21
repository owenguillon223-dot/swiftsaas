import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gift, Users, Wallet, CheckCircle2, CircleDashed } from "lucide-react";
import ParrainageLinkCopy from "./copy-link";
import ConnectStripeButton from "./connect-button";

const STATUTS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmé",
  PAID: "Payé",
};

export default async function ParrainagePage() {
  const session = await auth();

  const utilisateur = await prisma.user.findUnique({
    where: { id: (session?.user as any)?.id },
    include: {
      referrals: { select: { id: true, name: true, email: true, createdAt: true } },
      referralRewards: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!utilisateur) return null;

  const lien = `${process.env.NEXT_PUBLIC_APP_URL}/r/${utilisateur.referralCode}`;
  const totalCents = utilisateur.referralRewards.reduce((somme, r) => somme + r.amountCents, 0);
  const tauxPourcent = Math.round(Number(process.env.REFERRAL_COMMISSION_RATE ?? "0.2") * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Programme de parrainage</h1>
        <p className="text-muted-foreground">
          Partage ton lien : tu touches {tauxPourcent}% du premier paiement de chaque filleul.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ton lien de parrainage</CardTitle>
          <CardDescription>
            Toute inscription réalisée via ce lien dans les 30 jours te sera attribuée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ParrainageLinkCopy lien={lien} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Paiement automatique</CardTitle>
          <CardDescription>
            Connecte un compte Stripe pour recevoir tes commissions par virement, dès qu&apos;un
            filleul paye — sans action de ta part.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {utilisateur.stripeConnectPayoutsEnabled ? (
            <p className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Compte connecté — tes prochaines récompenses seront versées automatiquement.
            </p>
          ) : utilisateur.stripeConnectAccountId ? (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CircleDashed className="h-4 w-4" />
              Onboarding démarré mais pas encore terminé — complète-le pour activer les virements.
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CircleDashed className="h-4 w-4" />
              Aucun compte connecté pour l&apos;instant.
            </p>
          )}
          <ConnectStripeButton dejaConnecte={Boolean(utilisateur.stripeConnectAccountId)} />
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              Filleuls
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              {utilisateur.referrals.length}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="h-4 w-4 text-primary" />
              Récompenses
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              {utilisateur.referralRewards.length}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="h-4 w-4 text-primary" />
              Total gagné
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-foreground">
              {(totalCents / 100).toFixed(2)} €
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historique des récompenses</CardTitle>
          <CardDescription>
            Créées automatiquement au premier paiement d&apos;un filleul, puis versées par
            virement Stripe dès que ton compte est connecté et activé.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {utilisateur.referralRewards.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune récompense pour l&apos;instant.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-input text-muted-foreground">
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Montant</th>
                    <th className="py-2 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {utilisateur.referralRewards.map((recompense) => (
                    <tr key={recompense.id} className="border-b border-input last:border-0">
                      <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">
                        {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(
                          recompense.createdAt
                        )}
                      </td>
                      <td className="py-2 pr-4">
                        {(recompense.amountCents / 100).toFixed(2)} {recompense.currency.toUpperCase()}
                      </td>
                      <td className="py-2">
                        <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {STATUTS_LABELS[recompense.status] ?? recompense.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
