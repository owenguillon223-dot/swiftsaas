"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Landmark } from "lucide-react";

export default function ConnectStripeButton({ dejaConnecte }: { dejaConnecte: boolean }) {
  const [chargement, setChargement] = useState(false);

  async function connecter() {
    setChargement(true);
    try {
      const reponse = await fetch("/api/stripe/connect", { method: "POST" });
      const donnees = await reponse.json();
      if (donnees.url) window.location.href = donnees.url;
    } finally {
      setChargement(false);
    }
  }

  return (
    <Button type="button" onClick={connecter} disabled={chargement} variant={dejaConnecte ? "outline" : "default"}>
      <Landmark className="h-4 w-4" />
      {chargement
        ? "Redirection..."
        : dejaConnecte
          ? "Continuer / mettre à jour mes informations"
          : "Connecter mon compte Stripe"}
    </Button>
  );
}
