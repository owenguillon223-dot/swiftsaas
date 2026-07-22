import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RELANCE_STRIPE_PRICE_ID } from "@/lib/relance/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from "lucide-react";
import InvoiceManager from "./invoice-manager";
import SubscribeButton from "./subscribe-button";

export default async function RelancePage() {
  const session = await auth();
  const userId = (session?.user as { id: string } | undefined)?.id;

  const abonnementActif = userId
    ? await prisma.subscription.findFirst({
        where: { userId, stripePriceId: RELANCE_STRIPE_PRICE_ID, status: { in: ["ACTIVE", "TRIALING"] } },
      })
    : null;

  if (!abonnementActif) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold">RelanceIA</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Abonne-toi pour activer RelanceIA</CardTitle>
            <CardDescription>9€/mois, factures et relances illimitées, sans engagement.</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscribeButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <InvoiceManager />;
}
