import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Package, Truck, Home, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Confirmation() {
  const { orderId } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={48} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-[var(--text-primary)]">Merci pour votre commande !</h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Votre commande <span className="font-bold text-[var(--accent)]">#{orderId}</span> a été validée avec succès.
          </p>
        </div>

        <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm text-left space-y-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Prochaines étapes</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--accent)] shrink-0">
                <Package size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Préparation</h3>
                <p className="text-sm text-[var(--text-secondary)]">Nous préparons vos produits avec le plus grand soin.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--accent)] shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Expédition</h3>
                <p className="text-sm text-[var(--text-secondary)]">Vous recevrez un email dès que votre colis sera en route.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={`/suivi?orderId=${orderId}`}
            className="px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent)]/90 transition-colors flex items-center justify-center"
          >
            Suivre ma commande
            <ArrowRight className="ml-2" size={20} />
          </Link>
          <Link
            to="/"
            className="px-8 py-4 bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] font-bold rounded-full hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-center"
          >
            <Home className="mr-2" size={20} />
            Retour à l'accueil
          </Link>
        </div>

        <p className="text-sm text-[var(--text-secondary)]">
          Un email de confirmation a été envoyé à votre adresse. Si vous avez des questions, n'hésitez pas à nous contacter.
        </p>
      </motion.div>
    </div>
  );
}
