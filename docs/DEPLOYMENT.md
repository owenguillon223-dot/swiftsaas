# Déploiement sur Vercel

## 1. Préparer le dépôt Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<votre-compte>/<votre-repo>.git
git push -u origin main
```

## 2. Importer le projet sur Vercel

1. Allez sur vercel.com → New Project → Importez votre dépôt GitHub.
2. Vercel détecte automatiquement Next.js.

## 3. Variables d'environnement

Dans Vercel → Project Settings → Environment Variables, ajoutez toutes les variables de `.env.example`
avec vos valeurs de **production** (clés Stripe live, base de données de production, etc.).

## 4. Base de données de production

Utilisez un fournisseur PostgreSQL managé (Supabase, Neon, Railway, PlanetScale...).
Après le premier déploiement, appliquez le schéma :

```bash
DATABASE_URL="votre-url-de-prod" npx prisma migrate deploy
```

## 5. Webhook Stripe en production

Dans le Dashboard Stripe → Développeurs → Webhooks, ajoutez un endpoint :
`https://votre-domaine.fr/api/stripe/webhook`

Sélectionnez au minimum les événements :
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

Copiez le secret de signature généré dans la variable `STRIPE_WEBHOOK_SECRET` de Vercel.

## 6. Domaine personnalisé

Ajoutez votre domaine dans Vercel → Project Settings → Domains, puis mettez à jour
`NEXTAUTH_URL` et `NEXT_PUBLIC_APP_URL` avec l'URL finale.

## 7. Vérifications post-déploiement

- [ ] Inscription / connexion fonctionnent
- [ ] Email de bienvenue reçu
- [ ] Réinitialisation de mot de passe fonctionne
- [ ] Paiement test Stripe passe en mode live sans erreur
- [ ] Webhook Stripe reçoit bien les événements (Dashboard Stripe → Webhooks → logs)
- [ ] Pages légales à jour avec vos vraies informations
