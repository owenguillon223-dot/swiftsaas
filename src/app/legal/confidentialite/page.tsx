export default function ConfidentialitePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-neutral">
      <h1>Politique de confidentialité</h1>
      <p><em>Dernière mise à jour : 21 juillet 2026</em></p>

      <h2>Responsable du traitement</h2>
      <p>
        Owen Guillon, auto-entrepreneur (SwiftSaaS), 13 rue de la Treille,
        28130 Pierres — owenguillon223@gmail.com
      </p>

      <h2>Données collectées</h2>
      <p>
        Dans le cadre de l&apos;utilisation du site et du dashboard, SwiftSaaS peut
        collecter :
      </p>
      <ul>
        <li>Email, nom (à la création de compte)</li>
        <li>
          Données de paiement (traitées directement par Stripe, jamais stockées
          par SwiftSaaS)
        </li>
        <li>Données techniques (logs, cookies techniques nécessaires au fonctionnement)</li>
      </ul>

      <h2>Finalité</h2>
      <p>Ces données sont utilisées pour :</p>
      <ul>
        <li>Gérer les comptes utilisateurs et les commandes</li>
        <li>Fournir l&apos;accès aux produits achetés</li>
        <li>Répondre aux demandes de support</li>
      </ul>

      <h2>Base légale</h2>
      <p>
        Exécution du contrat (vente) et intérêt légitime (support, sécurité du
        service).
      </p>

      <h2>Destinataires</h2>
      <p>
        Les données de paiement sont traitées par Stripe (stripe.com), conformément
        à sa propre politique de confidentialité. Aucune donnée n&apos;est vendue à des
        tiers.
      </p>

      <h2>Durée de conservation</h2>
      <p>
        Les données sont conservées pendant la durée de la relation commerciale,
        puis archivées selon les obligations légales (comptables notamment),
        généralement 5 à 10 ans selon la nature du document.
      </p>

      <h2>Droits des utilisateurs</h2>
      <p>
        Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
        d&apos;effacement et d&apos;opposition sur vos données. Pour l&apos;exercer, contactez
        owenguillon223@gmail.com.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site utilise des cookies techniques nécessaires à son fonctionnement
        (session, authentification). Si des outils de mesure d&apos;audience (Google
        Analytics, Vercel Analytics, ou équivalent) sont ajoutés ultérieurement, un
        bandeau de consentement conforme au RGPD sera mis en place avant toute
        collecte.
      </p>
    </main>
  );
}
