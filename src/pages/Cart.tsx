import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const shipping = subtotal > 50 ? 0 : 5.90;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto text-[var(--text-secondary)]">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)]">Votre panier est vide</h1>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          Il semble que vous n'ayez pas encore ajouté de produits à votre panier. Découvrez nos collections pour trouver votre bonheur.
        </p>
        <Link
          to="/catalogue"
          className="inline-flex items-center px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent)]/90 transition-colors"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)] mb-12">Votre Panier ({totalItems})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="flex items-center gap-6 p-6 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)] shadow-sm"
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] truncate">{item.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{item.category}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-3 bg-[var(--bg-secondary)] rounded-full px-3 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center text-[var(--text-primary)]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-bold text-[var(--accent)]">
                    {((item.discount_price || item.price) * item.quantity).toFixed(2)}€
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm sticky top-32 space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Récapitulatif</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Livraison</span>
                <span>{shipping === 0 ? "Offerte" : `${shipping.toFixed(2)}€`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-[var(--accent)] font-medium">
                  Plus que {(50 - subtotal).toFixed(2)}€ pour la livraison offerte !
                </p>
              )}
              <div className="pt-4 border-t border-[var(--border)] flex justify-between text-lg font-bold text-[var(--text-primary)]">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>

            <Link
              to="/commande"
              className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent)]/90 transition-colors flex items-center justify-center group"
            >
              Passer à la commande
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
            </Link>

            <div className="pt-6 space-y-3">
              <p className="text-[10px] text-center text-[var(--text-secondary)] uppercase tracking-widest font-bold">
                Paiements Sécurisés
              </p>
              <div className="flex justify-center gap-4 opacity-50 grayscale dark:invert">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
