import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { createOrder, OrderPayload } from "../api/order.api";

const cardSchema = z.object({
  cardHolder: z.string().min(3, "Nom complet requis"),
  cardNumber: z.string().regex(/^\d{16}$/, "16 chiffres requis"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/AA requis"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV invalide"),
});

type CardFormData = z.infer<typeof cardSchema>;

export default function CardPayment() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const total = subtotal;

  const { register, handleSubmit, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
  });

  const onSubmit = async (formData: CardFormData) => {
    setIsProcessing(true);
    try {
      // 1. Récupération des infos de l'étape 2 (Checkout)
      const savedInfo = JSON.parse(localStorage.getItem("checkout_data") || "{}");
      
      // 2. Découpage de la date
      const [expiryMonth, expiryYear] = formData.expiryDate.split("/");

      // 3. Construction du Payload en respectant l'interface OrderPayload
      // On crée l'objet 'card' à l'intérieur pour que 'createOrder' puisse y accéder
      const payload: OrderPayload = {
        customer_name: savedInfo.customer_name,
        customer_surname: savedInfo.customer_surname,
        customer_email: savedInfo.customer_email,
        customer_phone: savedInfo.customer_phone,
        customer_country: savedInfo.customer_country,
        customer_city: savedInfo.customer_city,
        customer_address: savedInfo.customer_address,
        
        payment_method: "card",
        
        // C'est ici que l'objet 'card' doit exister pour ton API
        card: {
          card_number: formData.cardNumber,
          cvv: formData.cvv,
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
        },

        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      };

      // 4. Appel de l'API
      const res = await createOrder(payload);

      // 5. Succès
      if (res.data && res.data.order) {
        const orderNumber = res.data.order;
        clearCart();
        localStorage.removeItem("checkout_data");
        navigate(`/confirmation/${orderNumber}`);
      }

    } catch (err: any) {
      console.error("Erreur soumission:", err);
      alert(err.response?.data?.message || "Une erreur est survenue lors du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-[var(--text-secondary)] mb-8 hover:text-[var(--accent)] transition-colors">
        <ArrowLeft size={20} className="mr-2" /> Retour aux informations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* COLONNE FORMULAIRE */}
        <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-6">
          <h1 className="text-2xl font-serif font-bold text-[var(--text-primary)]">Paiement par Carte</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Titulaire de la carte</label>
              <input 
                {...register("cardHolder")} 
                placeholder="Jean Dupont" 
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] focus:border-[var(--accent)] outline-none" 
              />
              {errors.cardHolder && <p className="text-xs text-red-500">{errors.cardHolder.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Numéro de carte</label>
              <input 
                {...register("cardNumber")} 
                placeholder="4532 ...." 
                maxLength={16}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] focus:border-[var(--accent)] outline-none" 
              />
              {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Expiration (MM/AA)</label>
                <input {...register("expiryDate")} placeholder="12/25" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] outline-none" />
                {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">CVV</label>
                <input {...register("cvv")} placeholder="123" maxLength={4} className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] outline-none" />
                {errors.cvv && <p className="text-xs text-red-500">{errors.cvv.message}</p>}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing} 
              className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50"
            >
              {isProcessing ? "Traitement en cours..." : `Payer ${total.toFixed(2)}€`}
            </button>
          </form>

          <div className="flex justify-center items-center gap-2 text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-bold">
            <ShieldCheck size={14} />
            <span>Paiement sécurisé SSL 256-bit</span>
          </div>
        </div>

        {/* COLONNE RÉCAPITULATIF */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Récapitulatif</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">{item.name} <span className="text-xs">x{item.quantity}</span></span>
                  <span className="font-bold text-[var(--text-primary)]">{((item.discount_price || item.price) * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--border)] pt-4 flex justify-between text-lg font-bold text-[var(--text-primary)]">
              <span>Total</span>
              <span>{total.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}