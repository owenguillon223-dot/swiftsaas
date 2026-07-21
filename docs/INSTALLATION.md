# Guide d'installation

## Prérequis

- Node.js 18.17 ou supérieur
- Une base de données PostgreSQL (locale, ou hébergée : Supabase, Neon, Railway...)
- Un compte Stripe (mode test pour commencer)
- Un compte Resend pour l'envoi d'emails

## 1. Installation des dépendances

```bash
npm install
```

## 2. Variables d'environnement

Copiez `.env.example` vers `.env` et complétez :

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL de connexion PostgreSQL |
| `NEXTAUTH_URL` | URL de l'application (http://localhost:3000 en dev) |
| `NEXTAUTH_SECRET` | Générez avec `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (Dashboard → Développeurs → Clés API) |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe (voir étape 5) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe |
| `STRIPE_PRICE_ID_MENSUEL` / `STRIPE_PRICE_ID_ANNUEL` | IDs des prix créés dans Stripe |
| `RESEND_API_KEY` | Clé API Resend |
| `EMAIL_FROM` | Adresse d'expédition des emails (domaine vérifié dans Resend) |

## 3. Base de données

```bash
npm run db:push       # synchronise le schéma Prisma avec la base (développement)
# ou
npm run db:migrate    # crée une migration versionnée (recommandé en production)
```

## 4. Configuration Stripe

1. Créez vos produits/prix dans le Dashboard Stripe (mode test puis mode live).
2. Copiez les `price_id` dans `.env`.
3. Activez le portail client : Dashboard → Paramètres → Facturation → Portail client.

## 5. Webhook Stripe (développement local)

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copiez le secret affiché (`whsec_...`) dans `STRIPE_WEBHOOK_SECRET`.

## 6. Configuration Resend

1. Ajoutez et vérifiez votre domaine d'envoi sur resend.com.
2. Renseignez `RESEND_API_KEY` et `EMAIL_FROM` dans `.env`.

## 7. Lancer l'application

```bash
npm run dev
```

L'application est accessible sur http://localhost:3000.
