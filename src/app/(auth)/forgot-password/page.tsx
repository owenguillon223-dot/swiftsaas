"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChargement(true);

    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    // On affiche toujours le même message, que l'email existe ou non
    // (bonne pratique de sécurité : ne pas révéler si un compte existe).
    setEnvoye(true);
    setChargement(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Indiquez votre email, nous vous enverrons un lien de réinitialisation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {envoye ? (
            <p className="text-sm text-muted-foreground">
              Si un compte existe avec cet email, un lien de réinitialisation vient d'être envoyé.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={chargement}>
                {chargement ? "Envoi..." : "Envoyer le lien"}
              </Button>
            </form>
          )}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/login" className="hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
