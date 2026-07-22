import Link from "next/link";
import { Sparkles } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { RELANCE_STRIPE_PRICE_ID } from "@/lib/relance/constants";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userId = (session?.user as { id: string } | undefined)?.id;

  const abonnements = userId
    ? await prisma.subscription.findMany({
        where: { userId, status: { in: ["ACTIVE", "TRIALING"] } },
        select: { stripePriceId: true },
      })
    : [];

  const estAbonneRelance = abonnements.some((a) => a.stripePriceId === RELANCE_STRIPE_PRICE_ID);
  const estAbonneSwiftSaas = abonnements.some((a) => a.stripePriceId !== RELANCE_STRIPE_PRICE_ID);
  // Ni l'un ni l'autre (compte tout juste créé) : on affiche tout, le client n'a pas encore choisi.
  const afficherLesDeux = !estAbonneRelance && !estAbonneSwiftSaas;

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-4 w-4 text-primary" />
            {estAbonneRelance && !estAbonneSwiftSaas ? "RelanceIA" : "SwiftSaaS"}
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="hover:underline">Tableau de bord</Link>
            {(afficherLesDeux || estAbonneSwiftSaas) && (
              <Link href="/dashboard/agent" className="hover:underline">Agent IA</Link>
            )}
            {(afficherLesDeux || estAbonneRelance) && (
              <Link href="/dashboard/relance" className="hover:underline">RelanceIA</Link>
            )}
            <Link href="/dashboard/billing" className="hover:underline">Facturation</Link>
            {(afficherLesDeux || estAbonneSwiftSaas) && (
              <Link href="/dashboard/parrainage" className="hover:underline">Parrainage</Link>
            )}
            <Link href="/dashboard/settings" className="hover:underline">Paramètres</Link>
            <span className="text-muted-foreground">{session?.user?.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Déconnexion
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
