import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, Smartphone, Truck } from "lucide-react";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Téléphone requis"),
  country: z.string().min(2, "Pays requis"),
  city: z.string().min(2, "Ville requise"),
  address: z.string().min(5, "Adresse précise requise"),
  paymentMethod: z.enum(["card", "momo", "paypal", "cod"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shipping = subtotal > 50 ? 0 : 5.90;
  const total = subtotal + shipping;

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "card",
      country: "France",
    }
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // In a real front-end only app, we might save this to localStorage for tracking
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push({
        id: orderId,
        customer: data,
        items: cart,
        total: total,
        status: 'En attente',
        created_at: new Date().toISOString()
      });
      localStorage.setItem('orders', JSON.stringify(orders));

      clearCart();
      navigate(`/confirmation/${orderId}`);
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethod = watch("paymentMethod");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)] mb-12">Finaliser la commande</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2 space-y-12">
          {/* Personal Info */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
              <span className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
              Informations Personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Prénom</label>
                <input
                  {...register("firstName")}
                  className={`w-full px-4 py-3 rounded-xl border bg-[var(--bg-primary)] text-[var(--text-primary)] ${errors.firstName ? 'border-red-500' : 'border-[var(--border)]'} focus:outline-none focus:border-[var(--accent)]`}
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Nom</label>
                <input
                  {...register("lastName")}
                  className={`w-full px-4 py-3 rounded-xl border bg-[var(--bg-primary)] text-[var(--text-primary)] ${errors.lastName ? 'border-red-500' : 'border-[var(--border)]'} focus:outline-none focus:border-[var(--accent)]`}
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Email</label>
                <input
                  {...register("email")}
                  className={`w-full px-4 py-3 rounded-xl border bg-[var(--bg-primary)] text-[var(--text-primary)] ${errors.email ? 'border-red-500' : 'border-[var(--border)]'} focus:outline-none focus:border-[var(--accent)]`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Téléphone</label>
                <input
                  {...register("phone")}
                  className={`w-full px-4 py-3 rounded-xl border bg-[var(--bg-primary)] text-[var(--text-primary)] ${errors.phone ? 'border-red-500' : 'border-[var(--border)]'} focus:outline-none focus:border-[var(--accent)]`}
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
              <span className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
              Adresse de Livraison
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Pays</label>
                <input
                  {...register("country")}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Ville</label>
                <input
                  {...register("city")}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Adresse (Rue, Quartier, Repère)</label>
                <textarea
                  {...register("address")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
              <span className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
              Méthode de Paiement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: "card", name: "Carte Bancaire", icon: <CreditCard size={20} /> },
                { id: "momo", name: "Mobile Money", icon: <Smartphone size={20} /> },
                { id: "paypal", name: "PayPal", icon: <span className="font-bold italic">PP</span> },
                { id: "cod", name: "Paiement à la livraison", icon: <Truck size={20} /> },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === method.id ? "border-[var(--accent)] bg-[var(--bg-secondary)]" : "border-[var(--border)] hover:border-[var(--accent)]/50"
                  }`}
                >
                  <input
                    type="radio"
                    value={method.id}
                    {...register("paymentMethod")}
                    className="hidden"
                  />
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    paymentMethod === method.id ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                  }`}>
                    {method.icon}
                  </div>
                  <span className="font-bold text-sm text-[var(--text-primary)]">{method.name}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm sticky top-32 space-y-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Votre Commande</h2>
            
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--text-primary)] truncate">{item.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Qté: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {((item.discount_price || item.price) * item.quantity).toFixed(2)}€
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-[var(--border)] text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Livraison</span>
                <span>{shipping === 0 ? "Offerte" : `${shipping.toFixed(2)}€`}</span>
              </div>
              <div className="pt-4 border-t border-[var(--border)] flex justify-between text-lg font-bold text-[var(--text-primary)]">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? "Traitement..." : `Payer ${total.toFixed(2)}€`}
            </button>

            <div className="flex items-center justify-center space-x-2 text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
              <ShieldCheck size={14} />
              <span>Paiement 100% Sécurisé</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
