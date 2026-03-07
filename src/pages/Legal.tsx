export default function Legal() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-[var(--text-primary)] mb-12">Mentions Légales</h1>
      
      <div className="prose prose-stone max-w-none space-y-8 text-[var(--text-secondary)]">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">1. Éditeur du site</h2>
          <p>
            Le présent site est édité par la société LUMINA COSMETICS, Société par Actions Simplifiée au capital de 50 000 euros, dont le siège social est situé au 123 Avenue de la Beauté, 75008 Paris, immatriculée au Registre du Commerce et des Sociétés de Paris sous le numéro 123 456 789.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">2. Directeur de la publication</h2>
          <p>
            Le directeur de la publication est Monsieur Jean Beauté, en sa qualité de Président de LUMINA COSMETICS.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">3. Hébergement</h2>
          <p>
            Le site est hébergé par Google Cloud Platform, dont le siège social est situé à 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">4. Propriété intellectuelle</h2>
          <p>
            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">5. Contact</h2>
          <p>
            Pour toute question ou demande d'information concernant le site, ou tout signalement de contenu ou d'activités illicites, l'utilisateur peut contacter l'éditeur à l'adresse email suivante : contact@lumina-cosmetics.com ou par courrier recommandé avec accusé de réception adressé à l'éditeur aux coordonnées précisées dans les présentes mentions légales.
          </p>
        </section>
      </div>
    </div>
  );
}
