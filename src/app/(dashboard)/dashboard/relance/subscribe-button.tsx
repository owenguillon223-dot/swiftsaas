"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RELANCE_STRIPE_PRICE_ID } from "@/lib/relance/constants";

export default function SubscribeButton() {
  const [chargement, setChargement] = useState(false);

  async function lancerCheckout() {
    setChargement(true);
    try {
      const reponse = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: RELANCE_STRIPE_PRICE_ID, mode: "subscription" }),
      });
      const { url } = await reponse.json();
      if (url) window.location.href = url;
    } finally {
      setChargement(false);
    }
  }

  return (
    <Button onClick={lancerCheckout} disabled={chargement}>
      {chargement ? "Redirection..." : "S'abonner — 9€/mois"}
    </Button>
  );
}
