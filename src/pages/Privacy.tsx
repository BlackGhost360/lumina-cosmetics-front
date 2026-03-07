export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold text-[var(--text-primary)] mb-12">Politique de Confidentialité</h1>
      
      <div className="prose prose-stone max-w-none space-y-8 text-[var(--text-secondary)]">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">1. Collecte des données</h2>
          <p>
            Nous collectons les informations que vous nous fournissez lors de la passation d'une commande : nom, prénom, adresse email, numéro de téléphone et adresse de livraison. Ces informations sont nécessaires au traitement et à la livraison de vos commandes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">2. Utilisation des données</h2>
          <p>
            Vos données sont utilisées pour :
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gérer vos commandes et la livraison</li>
            <li>Vous envoyer des confirmations de commande et de livraison</li>
            <li>Assurer le service après-vente</li>
            <li>Vous envoyer notre newsletter si vous y avez consenti</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">3. Protection des données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, modification, divulgation ou destruction non autorisés. Vos informations de paiement sont traitées de manière sécurisée par nos prestataires de paiement certifiés.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">4. Vos droits</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données personnelles. Vous pouvez exercer ces droits en nous contactant à l'adresse : privacy@lumina-cosmetics.com.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">5. Cookies</h2>
          <p>
            Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser notre trafic. Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait limiter certaines fonctionnalités du site.
          </p>
        </section>
      </div>
    </div>
  );
}
