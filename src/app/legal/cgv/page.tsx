export default function CGVPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-neutral">
      <h1>Conditions Générales de Vente (CGV)</h1>
      <p><em>Dernière mise à jour : à compléter</em></p>

      <h2>Article 1 — Objet</h2>
      <p>
        Les présentes conditions générales de vente régissent les relations contractuelles entre
        [Votre société] (« l'Éditeur ») et toute personne physique ou morale (« le Client ») souhaitant
        souscrire à un abonnement ou effectuer un achat sur [nom de votre SaaS].
      </p>

      <h2>Article 2 — Description du service</h2>
      <p>
        Le service consiste en [décrivez votre SaaS]. L'accès au service est proposé sous forme
        d'abonnement mensuel ou annuel, ou de paiement unique selon l'offre choisie.
      </p>

      <h2>Article 3 — Prix et modalités de paiement</h2>
      <p>
        Les prix sont indiqués en euros, toutes taxes comprises. Le paiement est effectué en ligne via
        notre prestataire de paiement sécurisé Stripe, par carte bancaire.
      </p>

      <h2>Article 4 — Durée et résiliation</h2>
      <p>
        Les abonnements sont reconduits tacitement à chaque échéance (mensuelle ou annuelle). Le Client
        peut résilier à tout moment depuis son espace client (portail de facturation Stripe) ; la résiliation
        prend effet à la fin de la période en cours.
      </p>

      <h2>Article 5 — Droit de rétractation</h2>
      <p>
        Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique
        pas aux contenus numériques fournis immédiatement après accès et exécution intégrale, sauf disposition
        contraire indiquée lors de l'achat.
      </p>

      <h2>Article 6 — Responsabilité</h2>
      <p>
        L'Éditeur s'engage à fournir le service avec diligence, sans garantie de résultat. La responsabilité
        de l'Éditeur ne saurait être engagée en cas de force majeure ou de fait imputable à un tiers.
      </p>

      <h2>Article 7 — Données personnelles</h2>
      <p>
        Le traitement des données personnelles est décrit dans notre{" "}
        <a href="/legal/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Article 8 — Droit applicable et litiges</h2>
      <p>
        Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux français seront
        seuls compétents, après tentative de résolution amiable.
      </p>

      <p className="text-sm text-muted-foreground">
        ⚠️ Ce document est un modèle fourni à titre indicatif dans le cadre du boilerplate SwiftSaaS.
        Il ne constitue pas un conseil juridique. Faites-le valider par un professionnel du droit avant
        mise en ligne, et adaptez-le à votre activité réelle.
      </p>
    </main>
  );
}
