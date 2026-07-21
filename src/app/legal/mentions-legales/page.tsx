export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 prose prose-neutral">
      <h1>Mentions légales</h1>
      <p><em>Dernière mise à jour : à compléter</em></p>

      <h2>1. Éditeur du site</h2>
      <p>
        Le site [nom de votre SaaS] est édité par : [Votre nom / raison sociale],
        [forme juridique le cas échéant], immatriculé sous le numéro SIREN [à compléter],
        dont le siège social est situé à [adresse].
      </p>
      <p>
        Numéro de TVA intracommunautaire : [à compléter]<br />
        Email de contact : [contact@votredomaine.fr]<br />
        Directeur de la publication : [Nom Prénom]
      </p>

      <h2>2. Hébergement</h2>
      <p>
        Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
        La base de données est hébergée par [votre fournisseur PostgreSQL, ex. Supabase / Neon / Railway].
      </p>

      <h2>3. Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus présents sur ce site (textes, images, logos, code source) sont protégés
        par le droit de la propriété intellectuelle. Toute reproduction sans autorisation est interdite.
      </p>

      <h2>4. Responsabilité</h2>
      <p>
        L'éditeur s'efforce de fournir des informations aussi précises que possible, mais ne saurait
        être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour.
      </p>

      <h2>5. Contact</h2>
      <p>Pour toute question relative à ces mentions légales : [contact@votredomaine.fr]</p>

      <p className="text-sm text-muted-foreground">
        ⚠️ Ce document est un modèle fourni à titre indicatif dans le cadre du boilerplate SwiftSaaS.
        Il ne constitue pas un conseil juridique. Faites-le valider par un professionnel du droit avant
        mise en ligne, et complétez les champs entre crochets.
      </p>
    </main>
  );
}
