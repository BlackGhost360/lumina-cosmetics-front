import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, CreditCard, Lock } from "lucide-react";

const cardSchema = z.object({
  cardHolder: z.string().min(3, "Nom complet requis"),
  cardNumber: z.string().regex(/^\d{16}$/, "Numéro de carte invalide (16 chiffres)"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/AA requis"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV invalide (3 ou 4 chiffres)"),
});

type CardFormData = z.infer<typeof cardSchema>;

export default function CardPayment() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const shipping = subtotal > 50 ? 0 : 5.90;
  const total = subtotal + shipping;

  const { register, handleSubmit, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
  });

  const onSubmit = async (data: CardFormData) => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Save order to localStorage
    const customer = JSON.parse(localStorage.getItem('checkout_customer') || '{}');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      id: orderId,
      customer: { ...customer, cardHolder: data.cardHolder }, // Don't save sensitive data
      items: cart,
      total: total,
      method: 'Carte Bancaire',
      status: 'Payé',
      created_at: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('checkout_customer');

    clearCart();
    navigate(`/confirmation/${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">Votre panier est vide</h2>
        <button onClick={() => navigate('/catalogue')} className="text-[var(--accent)] font-bold underline">Retourner au catalogue</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Retour au choix du paiement
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Card Payment Section */}
        <div className="space-y-8">
          <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Paiement par Carte</h1>
              <div className="flex space-x-2 text-[var(--text-secondary)]">
                <CreditCard size={24} />
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Nom du titulaire</label>
                <input
                  {...register("cardHolder")}
                  placeholder="Jean Dupont"
                  className={`w-full px-4 py-3 rounded-xl border bg-[var(--bg-primary)] text-[var(--text-primary)] ${errors.cardHolder ? 'border-red-500' : 'border-[var(--border)]'} focus:outline-none focus:border-[var(--accent)]`}
                />
                {errors.cardHolder && <p className="text-xs text-red-500">{errors.cardHolder.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Numéro de carte</label>
                <div className="relative">
                  <input
                    {...register("cardNumber")}
                    placeholder="0000 0000 0000 0000"
                    maxLength={16}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-[var(--bg-primary)] text-[var(--text-primary)] ${errors.cardNumber ? 'border-red-500' : 'border-[var(--border)]'} focus:outline-none focus:border-[var(--accent)]`}
                  />
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
                </div>
                {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">Expiration (MM/AA)</label>
                  <input
                    {...register("expiryDate")}
                    placeholder="MM/AA"
                    maxLength={5}
                    className={`w-full px-4 py-3 rounded-xl border bg-[var(--bg-primary)] text-[var(--text-primary)] ${errors.expiryDate ? 'border-red-500' : 'border-[var(--border)]'} focus:outline-none focus:border-[var(--accent)]`}
                  />
                  {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">CVV</label>
                  <div className="relative">
                    <input
                      {...register("cvv")}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-[var(--bg-primary)] text-[var(--text-primary)] ${errors.cvv ? 'border-red-500' : 'border-[var(--border)]'} focus:outline-none focus:border-[var(--accent)]`}
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                  </div>
                  {errors.cvv && <p className="text-xs text-red-500">{errors.cvv.message}</p>}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    `Payer ${total.toFixed(2)}€`
                  )}
                </button>
              </div>
            </form>
            
            <div className="flex items-center justify-center space-x-2 text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} />
              <span>Paiement 100% Sécurisé</span>
            </div>
          </div>

          <div className="flex justify-center space-x-6 grayscale opacity-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Récapitulatif</h2>
            
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative">
                    <img src={`${import.meta.env.BASE_URL}${item.image}`} alt="" className="w-16 h-16 rounded-xl object-cover border border-[var(--border)]" referrerPolicy="no-referrer" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)]">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 py-1">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{item.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.brand}</p>
                  </div>
                  <span className="text-sm font-bold text-[var(--text-primary)] self-center">
                    {((item.discount_price || item.price) * item.quantity).toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-[var(--border)] text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Livraison</span>
                <span>{shipping === 0 ? "Offerte" : `${shipping.toFixed(2)}€`}</span>
              </div>
              <div className="pt-4 border-t border-[var(--border)] flex justify-between text-xl font-bold text-[var(--text-primary)]">
                <span>Total à payer</span>
                <span className="text-[var(--accent)]">{total.toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
