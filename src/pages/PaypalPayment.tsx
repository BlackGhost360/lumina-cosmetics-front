import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, CreditCard } from "lucide-react";

export default function PaypalPayment() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const shipping = subtotal > 50 ? 0 : 5.90;
  const total = subtotal + shipping;

  // Simulate loading state for the PayPal button
  const [isPaypalReady, setIsPaypalReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsPaypalReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePaypalPayment = async () => {
    setIsProcessing(true);
    // Simulate PayPal process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Save order to localStorage
    const customer = JSON.parse(localStorage.getItem('checkout_customer') || '{}');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push({
      id: orderId,
      customer,
      items: cart,
      total: total,
      method: 'PayPal',
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
        {/* PayPal Payment Section */}
        <div className="space-y-8">
          <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Paiement PayPal</h1>
              <div className="flex space-x-1">
                <span className="text-blue-600 font-black italic text-xl">Pay</span>
                <span className="text-blue-400 font-black italic text-xl">Pal</span>
              </div>
            </div>
            
            <p className="text-[var(--text-secondary)]">
              Vous allez être redirigé vers le site sécurisé de PayPal pour finaliser votre paiement.
            </p>

            <div className="space-y-4 pt-4">
              {isPaypalReady ? (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handlePaypalPayment}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#ffc439] text-[#111] font-bold rounded-full hover:bg-[#f2ba36] transition-colors flex items-center justify-center space-x-2 shadow-md"
                >
                  {isProcessing ? (
                    <div className="w-6 h-6 border-2 border-[#111] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="text-blue-800 font-black italic">Pay</span>
                      <span className="text-blue-500 font-black italic">Pal</span>
                      <span className="ml-2">Payer {total.toFixed(2)}€</span>
                    </>
                  )}
                </motion.button>
              ) : (
                <div className="w-full h-14 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              )}
              
              <div className="flex items-center justify-center space-x-2 text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                <ShieldCheck size={14} />
                <span>Transaction 100% Sécurisée</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
            <h3 className="text-blue-800 dark:text-blue-300 font-bold mb-2 flex items-center">
              <CreditCard size={18} className="mr-2" />
              Pourquoi PayPal ?
            </h3>
            <p className="text-blue-700/80 dark:text-blue-400/80 text-sm leading-relaxed">
              PayPal est un moyen simple et sécurisé de payer en ligne sans partager vos informations bancaires avec le marchand.
            </p>
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
