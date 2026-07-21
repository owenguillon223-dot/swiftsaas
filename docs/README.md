# SwiftSaaS

Boilerplate SaaS clé en main, en français, pour lancer un produit en quelques jours.

## Stack technique

- **Next.js 14+** (App Router) + **TypeScript**
- **Prisma** + **PostgreSQL**
- **NextAuth.js (Auth.js v5)** — authentification par email/mot de passe
- **Stripe** — abonnements, paiements uniques, webhooks, portail client, **+ facturation à l'usage (Meters)** pour le module Agent IA
- **Agent IA multi-provider (Claude / OpenAI)** — vraie boucle d'agent avec appel d'outils, un run = un événement facturable
- **shadcn/ui** + **Tailwind CSS**
- **Resend** — emails transactionnels (bienvenue, réinitialisation de mot de passe)
- Landing page + pages légales incluses

## Structure du projet

```
swiftsaas/
├── prisma/
│   └── schema.prisma          # User, Subscription, Payment, GeneratedProject...
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── (auth)/            # login, register, forgot/reset password
│   │   ├── (dashboard)/       # dashboard, billing, settings
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth + inscription + reset password
│   │   │   └── stripe/        # checkout, portail client, webhook
│   │   └── legal/             # CGV, mentions légales, confidentialité
│   │   │   └── agent/          # POST /api/agent — exécute une boucle d'agent + facture le run
│   ├── components/ui/         # Button, Input, Label, Card (style shadcn/ui)
│   ├── lib/
│   │   ├── ai/                 # Providers Claude / OpenAI (interface commune AIProvider)
│   │   ├── agent/               # loop.ts (boucle d'agent), types.ts (contrat partagé)
│   │   ├── tools/                # Outils appelables par l'agent (ex: calculatrice)
│   │   ├── billing-meter.ts      # Reporte un événement Stripe Meter par run d'agent
│   │   └── prisma.ts, auth.ts, stripe.ts, resend.ts, utils.ts
│   ├── emails/                # Templates React Email
│   └── middleware.ts          # Protection des routes /dashboard
├── scripts/
│   └── generate-saas.ts       # Génère un nouveau SaaS à partir d'une description
└── docs/                      # Cette documentation
```

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Complétez DATABASE_URL, NEXTAUTH_SECRET, les clés Stripe et Resend

# 3. Créer la base de données
npm run db:push

# 4. Lancer le serveur de développement
npm run dev
```

Voir `INSTALLATION.md` pour le détail de chaque étape et `DEPLOYMENT.md` pour la mise en production sur Vercel.

## Générateur automatique de SaaS

Le script `scripts/generate-saas.ts` permet de dupliquer ce boilerplate vers un nouveau projet
personnalisé à partir d'une simple description :

```bash
npm run generate:saas -- --nom "MonSaaS" --description "Un outil de gestion de projet pour freelances" --dossier ../mon-saas
```

Si la variable d'environnement `ANTHROPIC_API_KEY` est définie, le script génère automatiquement
une accroche et une liste de fonctionnalités adaptées à votre description via l'API Claude.
Sans cette clé, le script copie simplement le boilerplate en remplaçant le nom du produit.

## Licence

Voir `LICENSE.md`. En résumé : usage commercial autorisé pour vos propres projets clients,
revente du boilerplate lui-même (en l'état ou légèrement modifié) interdite.
