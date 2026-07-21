export default function ConfidentialitePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-neutral">
      <h1>Politique de confidentialité</h1>
      <p><em>Dernière mise à jour : à compléter</em></p>

      <h2>1. Responsable du traitement</h2>
      <p>
        [Votre société], [adresse], est responsable du traitement des données personnelles collectées
        sur ce site, conformément au Règlement Général sur la Protection des Données (RGPD).
      </p>

      <h2>2. Données collectées</h2>
      <ul>
        <li>Données d'identification : nom, adresse email</li>
        <li>Données de connexion : mot de passe (haché), historique de connexion</li>
        <li>Données de facturation : traitées par Stripe (nous ne stockons pas les numéros de carte)</li>
      </ul>

      <h2>3. Finalités du traitement</h2>
      <ul>
        <li>Gestion des comptes utilisateurs et de l'authentification</li>
        <li>Gestion des abonnements et de la facturation</li>
        <li>Envoi d'emails transactionnels (confirmation, réinitialisation de mot de passe)</li>
        <li>Amélioration du service</li>
      </ul>

      <h2>4. Base légale</h2>
      <p>
        Les traitements reposent sur l'exécution du contrat (fourniture du service) et, le cas échéant,
        sur le consentement de l'utilisateur (emails marketing).
      </p>

      <h2>5. Destinataires des données</h2>
      <p>
        Les données peuvent être transmises à nos sous-traitants techniques : Vercel (hébergement),
        Stripe (paiements), Resend (emails transactionnels), dans le cadre strict de leurs missions.
      </p>

      <h2>6. Durée de conservation</h2>
      <p>
        Les données sont conservées pendant la durée de la relation contractuelle, puis archivées
        conformément aux obligations légales.
      </p>

      <h2>7. Droits des utilisateurs</h2>
      <p>
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de
        limitation, d'opposition et de portabilité de vos données. Pour exercer ces droits, contactez :
        [contact@votredomaine.fr].
      </p>

      <h2>8. Cookies</h2>
      <p>
        Ce site utilise uniquement des cookies strictement nécessaires au fonctionnement du service
        (session d'authentification). Aucun cookie de tracking publicitaire n'est utilisé par défaut.
      </p>

      <p className="text-sm text-muted-foreground">
        ⚠️ Ce document est un modèle fourni à titre indicatif dans le cadre du boilerplate SwiftSaaS.
        Il ne constitue pas un conseil juridique. Faites-le valider par un professionnel du droit avant
        mise en ligne, et adaptez-le à votre activité réelle et à vos sous-traitants effectifs.
      </p>
    </main>
  );
}
