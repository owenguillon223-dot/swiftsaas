---
title: "Comment facturer une fonctionnalité IA à l'usage avec Stripe Meters"
description: "Le guide pratique pour mettre en place une facturation par run avec Stripe Billing Meters, sans refaire toute ta stack de paiement."
date: "2026-07-20"
---

Dès qu'un produit intègre un appel à un modèle comme Claude ou GPT, le modèle de prix classique (un forfait mensuel fixe) devient bancal. Un utilisateur qui lance 5 runs d'agent par mois et un autre qui en lance 500 ne coûtent pas la même chose à servir — et pourtant ils payent le même abonnement. La facturation à l'usage résout ce problème, mais elle a longtemps demandé de construire soi-même un système de comptage, de seuils et de rapprochement avec Stripe. Les **Stripe Billing Meters** changent ça.

## Le principe

Un Meter Stripe est un compteur d'événements. Chaque fois qu'une action facturable se produit côté serveur (par exemple : un run d'agent qui se termine), tu envoies un événement au Meter avec l'identifiant du client Stripe concerné et une valeur (souvent `1`, mais ça peut être un nombre de tokens, de requêtes, etc.). Stripe agrège ces événements sur la période de facturation et les traduit en montant dû, selon un `Price` de type `metered` que tu relies au Meter.

Concrètement, ça se met en place en trois étapes :

1. **Créer le Meter** — dans le dashboard Stripe (Billing > Meters) ou via l'API, avec un `event_name` (ex: `agent_run`) et une règle d'agrégation (le plus souvent une somme).
2. **Créer un Price metered** relié à ce Meter, avec un prix unitaire (ex: 0,10 € par run) et le même intervalle de facturation que l'abonnement auquel il s'attache.
3. **Reporter un événement à chaque run** depuis ton backend, via `stripe.billing.meterEvents.create()`, en associant l'événement au `stripe_customer_id` du client.

## Le piège le plus courant

La confusion classique : créer le Meter et y envoyer des événements, mais oublier de créer et d'attacher le Price metered à l'abonnement. Dans ce cas, Stripe compte bien les événements — tu peux les voir s'accumuler dans le dashboard — mais **personne n'est facturé**, parce qu'aucun prix n'est relié à ce comptage. Le Meter et le Price sont deux ressources distinctes qu'il faut explicitement connecter.

Deuxième piège : mélanger des intervalles de facturation différents. Un abonnement ne peut pas facilement combiner un Price mensuel fixe et un Price metered annuel dans une même souscription — garde le même intervalle (`month` avec `month`, `year` avec `year`) sur toutes les lignes d'un même abonnement.

## Ne pas bloquer la réponse utilisateur sur la facturation

Le reporting d'usage ne doit jamais être une dépendance bloquante du chemin critique. Si l'appel à `meterEvents.create()` échoue (réseau, Stripe indisponible), l'utilisateur doit quand même recevoir la réponse de son agent — l'erreur de facturation doit être journalisée et éventuellement retentée, pas remontée comme une erreur 500 sur la requête principale.

## Rendre l'usage visible au client

Un compteur invisible génère de la méfiance ("pourquoi je suis facturé, je ne sais pas pour quoi"). Le minimum viable côté produit : un historique des événements facturables (date, statut de facturation) visible dans le dashboard, et idéalement un lien direct vers le portail client Stripe pour consulter les factures détaillées.

C'est exactement ce que fait le module Agent IA de SwiftSaaS : chaque run authentifié est à la fois reporté au Meter Stripe et persisté en base, pour apparaître dans un historique consultable — pas juste un chiffre agrégé sur une facture en fin de mois.
