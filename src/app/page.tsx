import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ShieldCheck,
  CreditCard,
  LayoutDashboard,
  Mail,
  Database,
  Rocket,
  Bot,
  Check,
  Sparkles,
} from "lucide-react";

const FONCTIONNALITES = [
  {
    titre: "Authentification complète",
    description: "Inscription, connexion, mot de passe oublié — sécurisé avec Auth.js v5.",
    icone: ShieldCheck,
  },
  {
    titre: "Agent IA facturé à l'usage",
    description: "Boucle d'agent multi-provider (Claude / OpenAI) avec appel d'outils et facturation Stripe Meters.",
    icone: Bot,
    nouveau: true,
  },
  {
    titre: "Paiements Stripe intégrés",
    description: "Abonnements, paiements uniques, webhooks et portail client, prêts à l'emploi.",
    icone: CreditCard,
  },
  {
    titre: "Dashboard utilisateur",
    description: "Un espace client moderne pour gérer abonnement, factures et paramètres.",
    icone: LayoutDashboard,
  },
  {
    titre: "Emails transactionnels",
    description: "Bienvenue, réinitialisation de mot de passe, reçus — envoyés via Resend.",
    icone: Mail,
  },
  {
    titre: "Base de données Prisma",
    description: "Schéma prêt pour PostgreSQL : utilisateurs, abonnements, paiements, runs d'agent.",
    icone: Database,
  },
  {
    titre: "Déploiement Vercel",
    description: "Configuration optimisée pour un déploiement en un clic.",
    icone: Rocket,
  },
];

const TARIFS = [
  {
    nom: "Mensuel",
    prix: "19€",
    periode: "/ mois",
    avantages: [
      "Toutes les fonctionnalités",
      "Agent IA inclus (0,10€ / run au-delà du forfait)",
      "Support par email",
      "Mises à jour incluses",
    ],
  },
  {
    nom: "Annuel",
    prix: "190€",
    periode: "/ an",
    avantages: ["2 mois offerts", "Agent IA inclus", "Support prioritaire", "Mises à jour incluses"],
    populaire: true,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-primary" />
            SwiftSaaS
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

      {/* Hero */}
      <section className="hero-gradient">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Bot className="h-3.5 w-3.5" />
            Nouveau : module Agent IA facturé à l&apos;usage
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Lancez votre SaaS <span className="gradient-text">IA</span> en quelques jours,
            pas en quelques mois
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Un boilerplate complet, en français, prêt pour la production : authentification, paiements Stripe,
            dashboard utilisateur — et un agent IA multi-provider facturé à l&apos;usage, prêt à revendre.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/register">Commencer maintenant</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#tarifs">Voir les tarifs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">Tout est déjà prêt</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FONCTIONNALITES.map((f) => (
            <Card key={f.titre} className={f.nouveau ? "border-primary/40" : ""}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <f.icone className="h-4.5 w-4.5" />
                  </div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {f.titre}
                    {f.nouveau && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        NOUVEAU
                      </span>
                    )}
                  </CardTitle>
                </div>
                <CardDescription className="pt-1">{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">Tarifs simples et transparents</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Un abonnement fixe, plus l&apos;agent IA facturé à l&apos;usage — tu ne payes que ce que tes
          utilisateurs consomment.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {TARIFS.map((t) => (
            <Card key={t.nom} className={t.populaire ? "border-primary shadow-lg shadow-primary/10" : ""}>
              <CardHeader>
                {t.populaire && (
                  <span className="mb-2 inline-block w-fit rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    LE PLUS CHOISI
                  </span>
                )}
                <CardTitle>{t.nom}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">{t.prix}</span> {t.periode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {t.avantages.map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/register">Choisir cette offre</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} SwiftSaaS. Tous droits réservés.</span>
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
