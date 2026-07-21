import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const FONCTIONNALITES = [
  {
    titre: "Authentification complète",
    description: "Inscription, connexion, mot de passe oublié — sécurisé avec Auth.js v5.",
  },
  {
    titre: "Paiements Stripe intégrés",
    description: "Abonnements, paiements uniques, webhooks et portail client, prêts à l'emploi.",
  },
  {
    titre: "Dashboard utilisateur",
    description: "Un espace client moderne pour gérer abonnement, factures et paramètres.",
  },
  {
    titre: "Emails transactionnels",
    description: "Bienvenue, réinitialisation de mot de passe, reçus — envoyés via Resend.",
  },
  {
    titre: "Base de données Prisma",
    description: "Schéma prêt pour PostgreSQL : utilisateurs, abonnements, paiements.",
  },
  {
    titre: "Déploiement Vercel",
    description: "Configuration optimisée pour un déploiement en un clic.",
  },
];

const TARIFS = [
  {
    nom: "Mensuel",
    prix: "19€",
    periode: "/ mois",
    avantages: ["Toutes les fonctionnalités", "Support par email", "Mises à jour incluses"],
  },
  {
    nom: "Annuel",
    prix: "190€",
    periode: "/ an",
    avantages: ["2 mois offerts", "Support prioritaire", "Mises à jour incluses"],
    populaire: true,
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold">SwiftSaaS</span>
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
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Lancez votre SaaS en quelques jours, pas en quelques mois
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Un boilerplate complet, en français, prêt pour la production : authentification, paiements Stripe,
          dashboard utilisateur et bien plus.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/register">Commencer maintenant</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#tarifs">Voir les tarifs</Link>
          </Button>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">Tout est déjà prêt</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FONCTIONNALITES.map((f) => (
            <Card key={f.titre}>
              <CardHeader>
                <CardTitle className="text-base">{f.titre}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">Tarifs simples et transparents</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {TARIFS.map((t) => (
            <Card key={t.nom} className={t.populaire ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{t.nom}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">{t.prix}</span> {t.periode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {t.avantages.map((a) => (
                    <li key={a}>✓ {a}</li>
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
