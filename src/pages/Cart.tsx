import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const shipping = 0;
  const total = subtotal + shipping;
  const API_URL = import.meta.env.VITE_API_URL_BASE;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
        <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto text-[var(--text-secondary)]">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)]">Votre panier est vide</h1>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          Il semble que vous n'ayez pas encore ajouté de produits à votre panier.
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
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="flex items-start sm:items-center gap-4 p-4 sm:p-6 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border)] shadow-sm"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                <img src={`${API_URL}/storage/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] break-words leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)]">{item.category}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-[var(--text-secondary)] hover:text-red-500 shrink-0 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
                  <div className="flex items-center space-x-3 bg-[var(--bg-secondary)] rounded-full px-3 py-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[var(--text-secondary)]"><Minus size={14} /></button>
                    <span className="text-sm font-bold w-4 text-center text-[var(--text-primary)]">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[var(--text-secondary)]"><Plus size={14} /></button>
                  </div>
                  <span className="font-bold text-[var(--accent)] whitespace-nowrap">
                    {((item.discount_price || item.price) * item.quantity).toFixed(2)}€
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
                <span>Offerte</span>
              </div>
              <div className="pt-4 border-t border-[var(--border)] flex justify-between text-lg font-bold text-[var(--text-primary)]">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>
            <Link to="/commande" className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent)]/90 transition-colors flex items-center justify-center group">
              Passer à la commande
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}