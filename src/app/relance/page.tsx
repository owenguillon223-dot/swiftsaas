import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Clock, ShieldCheck, Check, Sparkles, TrendingDown } from "lucide-react";

export const metadata: Metadata = {
  title: "RelanceIA — L'agent IA qui relance vos factures impayées",
  description:
    "Les indépendants français perdent en moyenne 15% de leur chiffre d'affaires faute de relances systématiques. RelanceIA rédige et envoie vos relances de factures automatiquement, avec le bon ton au bon moment.",
};

const ETAPES = [
  { titre: "Ajoutez votre facture impayée", description: "Client, montant, date d'échéance — 30 secondes.", icone: Clock },
  { titre: "L'IA rédige la relance", description: "Ton amical, ferme ou formel selon le retard — jamais agressif trop tôt.", icone: Sparkles },
  { titre: "L'email part automatiquement", description: "Vous gardez le contrôle : historique complet de chaque relance envoyée.", icone: Mail },
];

export default function RelanceLandingPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 text-xl font-bold">
            <Mail className="h-5 w-5 text-primary" />
            RelanceIA
          </span>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Connexion
            </Link>
            <Button asChild size="sm">
              <Link href="/register">Essayer gratuitement</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="hero-gradient">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <TrendingDown className="h-3.5 w-3.5" />
            4 millions d&apos;indépendants français, 15% de CA perdu en factures impayées
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Ne perdez plus d&apos;argent à <span className="gradient-text">oublier de relancer</span> vos clients
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            RelanceIA rédige et envoie vos emails de relance de factures impayées automatiquement — avec le bon
            ton, au bon moment, sans que vous ayez à y penser.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Commencer gratuitement</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#tarifs">Voir les tarifs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">Comment ça marche</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {ETAPES.map((etape, i) => (
            <Card key={etape.titre}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <etape.icone className="h-4.5 w-4.5" />
                  </div>
                  <CardTitle className="text-base">
                    {i + 1}. {etape.titre}
                  </CardTitle>
                </div>
                <CardDescription className="pt-1">{etape.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <Card className="border-primary/30">
          <CardContent className="flex items-start gap-3 pt-6">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">
              Le ton s&apos;adapte à l&apos;ancienneté du retard : amical dans les 7 premiers jours (on suppose un
              oubli, pas une mauvaise foi), ferme entre 7 et 30 jours, formel au-delà — avec mention des pénalités
              légales de retard (article L441-10 du Code de commerce) uniquement en dernier recours.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="tarifs" className="mx-auto max-w-md px-6 py-16">
        <h2 className="text-center text-3xl font-bold">Un seul tarif, simple</h2>
        <Card className="mt-10 border-primary shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle>RelanceIA</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-foreground">9€</span> / mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Factures illimitées", "Relances IA illimitées", "Historique complet", "Sans engagement"].map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {a}
                </li>
              ))}
            </ul>
            <Button className="mt-6 w-full" asChild>
              <Link href="/register">Commencer</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} RelanceIA.</span>
          <div className="flex gap-4">
            <Link href="/legal/mentions-legales">Mentions légales</Link>
            <Link href="/legal/cgv">CGV</Link>
            <Link href="/legal/confidentialite">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
