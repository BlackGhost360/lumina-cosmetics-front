import { useState } from "react";
import { Link } from "react-router-dom"; // Import manquant ajouté
import { Plus, Minus, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Nous expédions vos commandes sous 24h ouvrées. Les délais de livraison standard sont ensuite de 2 à 4 jours ouvrés pour la France métropolitaine."
  },
  {
    question: "Vos produits sont-ils testés sur les animaux ?",
    answer: "Absolument pas. Lumina Cosmetics est fermement engagée contre la cruauté animale. Aucun de nos produits ou ingrédients n'est testé sur les animaux."
  },
  {
    question: "Puis-je retourner un produit s'il ne me convient pas ?",
    answer: "Oui, vous disposez de 30 jours après réception de votre commande pour nous retourner un produit non ouvert et dans son emballage d'origine. Les frais de retour sont à notre charge."
  },
  {
    question: "Comment suivre l'état de ma commande ?",
    answer: "Vous pouvez suivre votre commande en temps réel sur notre page 'Suivi de commande' en utilisant votre numéro de commande reçu par email."
  },
  {
    question: "Proposez-vous des échantillons ?",
    answer: "Nous glissons systématiquement 2 échantillons offerts dans chaque commande pour vous faire découvrir nos nouveautés."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-16">
        <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto text-[var(--accent)]">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl font-serif font-bold text-[var(--text-primary)]">Questions Fréquentes</h1>
        <p className="text-[var(--text-secondary)]">Tout ce que vous devez savoir sur nos produits et services.</p>
      </div>

      {/* Accordion FAQ */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-[var(--bg-secondary)] transition-colors focus:outline-none"
            >
              <span className="font-bold text-[var(--text-primary)]">{faq.question}</span>
              <div className={`text-[var(--accent)] transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
              </div>
            </button>
            
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="mt-16 bg-[var(--bg-secondary)] rounded-3xl p-8 text-center space-y-6">
        <div className="space-y-2">
          <h3 className="font-bold text-[var(--text-primary)] text-xl">
            Vous n'avez pas trouvé votre réponse ?
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Notre service client est disponible pour vous aider.
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-10 py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent)]/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[var(--accent)]/20"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}