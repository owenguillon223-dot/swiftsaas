"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function BillingPage() {
  const [chargement, setChargement] = useState<string | null>(null);

  async function lancerCheckout(priceId: string) {
    setChargement(priceId);
    const reponse = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, mode: "subscription" }),
    });
    const { url } = await reponse.json();
    if (url) window.location.href = url;
    setChargement(null);
  }

  async function ouvrirPortailClient() {
    setChargement("portail");
    const reponse = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await reponse.json();
    if (url) window.location.href = url;
    setChargement(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Facturation</h1>
        <p className="text-muted-foreground">Gérez votre abonnement et vos moyens de paiement.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gérer mon abonnement</CardTitle>
          <CardDescription>
            Accédez au portail Stripe pour changer de plan, mettre à jour votre carte ou télécharger vos factures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={ouvrirPortailClient} disabled={chargement === "portail"}>
            {chargement === "portail" ? "Redirection..." : "Ouvrir le portail client"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan mensuel</CardTitle>
            <CardDescription>19€ / mois</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => lancerCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_MENSUEL ?? "")}
              disabled={chargement !== null}
            >
              S'abonner
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Plan annuel</CardTitle>
            <CardDescription>190€ / an (2 mois offerts)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => lancerCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUEL ?? "")}
              disabled={chargement !== null}
            >
              S'abonner
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
