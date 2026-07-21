---
title: "Ce qu'il y a (vraiment) dans un boilerplate SaaS Next.js prêt pour la prod"
description: "Auth, paiements, dashboard, agent IA : tour d'horizon de ce qui doit être déjà fait pour ne pas perdre des semaines avant ton premier client."
date: "2026-07-15"
---

Avant d'écrire la moindre ligne de code métier, un SaaS a besoin d'une dizaine de briques qui n'ont, individuellement, rien de passionnant — mais qui prennent chacune plusieurs jours à faire correctement. C'est cette accumulation qui transforme un weekend de prototypage en deux mois de retard avant le premier client payant.

## Authentification : plus qu'un formulaire de connexion

Un système d'auth qui tient la route en production couvre : inscription avec hash de mot de passe (bcrypt, jamais en clair), connexion, réinitialisation de mot de passe par email avec token à expiration, protection des routes privées via middleware, et — souvent oublié — une limite de tentatives sur les endpoints sensibles pour éviter le brute force. Chacun de ces points est un détail de sécurité facile à rater sous pression de deadline.

## Paiements : abonnements, pas juste un bouton "payer"

Accepter un paiement Stripe ponctuel prend une heure. Gérer un cycle de vie d'abonnement complet — création du client Stripe, session de checkout, synchronisation du statut via webhook (`active`, `past_due`, `canceled`), portail client pour changer de plan ou de moyen de paiement — prend nettement plus longtemps, et la moindre erreur dans la gestion des webhooks se traduit directement par des utilisateurs qui payent sans accès, ou l'inverse.

## Dashboard : l'espace que l'utilisateur voit tous les jours

C'est la partie la plus visible et pourtant souvent la plus négligée en tout début de projet : une page de facturation claire, des paramètres de compte, et — si le produit a une composante IA — un espace pour utiliser la fonctionnalité et suivre sa consommation.

## Emails transactionnels

Bienvenue, réinitialisation de mot de passe, reçus : ce sont des emails qu'un utilisateur *doit* recevoir pour utiliser le produit normalement, pas du marketing. Ils méritent un provider dédié (Resend, Postmark) plutôt qu'un serveur SMTP bricolé, et une génération de templates qui ne casse pas au moindre changement de design.

## Base de données : le schéma compte autant que le code

Utilisateurs, abonnements, paiements — et si le produit a une fonctionnalité IA facturée à l'usage, un historique des runs. Un schéma Prisma bien pensé dès le départ (relations, index sur les clés étrangères, énumérations pour les statuts) évite des migrations douloureuses six mois plus tard.

## Et ensuite : le module qui différencie

Une fois ces fondations posées, ce qui reste à construire, c'est ce qui rend *ton* produit différent — pas l'authentification, que tout le monde refait pareil. C'est la logique derrière SwiftSaaS : le socle (auth, Stripe, dashboard, emails, base de données) est déjà là, avec en plus un module agent IA multi-provider facturé à l'usage prêt à l'emploi, pour que le temps de développement aille sur ce qui compte vraiment.
