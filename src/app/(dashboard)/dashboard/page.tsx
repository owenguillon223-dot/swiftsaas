import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();

  const abonnement = await prisma.subscription.findFirst({
    where: { userId: (session?.user as any)?.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour {session?.user?.name ?? ""} 👋</h1>
        <p className="text-muted-foreground">Voici un aperçu de votre compte.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statut de l'abonnement</CardTitle>
            <CardDescription>
              {abonnement ? abonnement.status : "Aucun abonnement actif"}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan actuel</CardTitle>
            <CardDescription>{abonnement?.stripePriceId ?? "—"}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Renouvellement</CardTitle>
            <CardDescription>
              {abonnement
                ? new Intl.DateTimeFormat("fr-FR").format(abonnement.currentPeriodEnd)
                : "—"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
