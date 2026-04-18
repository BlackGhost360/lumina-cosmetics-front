import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShieldCheck, CreditCard } from "lucide-react";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Prénom requis"),
  customer_surname: z.string().min(2, "Nom requis"),
  customer_email: z.string().email("Email invalide"),
  customer_phone: z.string().min(10, "Téléphone requis"),
  customer_country: z.string().min(2, "Pays requis"),
  customer_city: z.string().min(2, "Ville requise"),
  customer_address: z.string().min(5, "Adresse précise requise"),
  paymentMethod: z.enum(["card", "paypal"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { cart, subtotal } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = subtotal;
  const API_URL = import.meta.env.VITE_API_URL_BASE;

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "card", customer_country: "France" }
  });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    // Sauvegarde pour l'étape finale
    localStorage.setItem('checkout_data', JSON.stringify(data));
    
    setTimeout(() => {
      if (data.paymentMethod === 'card') {
        navigate('/paiement/carte');
      } else {
        navigate('/paiement/paypal');
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)] mb-12">Finaliser la commande</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center">
              <span className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
              Informations Personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Prénom</label>
                <input {...register("customer_name")} className={`w-full px-4 py-3 rounded-xl border bg-[var(--bg-primary)] ${errors.customer_name ? 'border-red-500' : 'border-[var(--border)]'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Nom</label>
                <input {...register("customer_surname")} className={`w-full px-4 py-3 rounded-xl border bg-[var(--bg-primary)] ${errors.customer_surname ? 'border-red-500' : 'border-[var(--border)]'}`} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Email</label>
                <input {...register("customer_email")} className="w-full px-4 py-3 rounded-xl border bg-[var(--bg-primary)]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Téléphone</label>
                <input {...register("customer_phone")} className="w-full px-4 py-3 rounded-xl border bg-[var(--bg-primary)]" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center">
              <span className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
              Adresse de Livraison
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input {...register("customer_country")} placeholder="Pays" className="w-full px-4 py-3 rounded-xl border" />
              <input {...register("customer_city")} placeholder="Ville" className="w-full px-4 py-3 rounded-xl border" />
              <textarea {...register("customer_address")} placeholder="Adresse complète" className="md:col-span-2 w-full px-4 py-3 rounded-xl border" rows={3} />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center">
              <span className="w-8 h-8 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
              Méthode de Paiement
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? "border-[var(--accent)] bg-[var(--bg-secondary)]" : "border-[var(--border)]"}`}>
                <input type="radio" value="card" {...register("paymentMethod")} className="hidden" />
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-[var(--accent)] text-white"><CreditCard size={20} /></div>
                <span className="font-bold text-sm">Carte Bancaire</span>
              </label>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm sticky top-32 space-y-8">
            <h2 className="text-xl font-bold">Votre Commande</h2>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img src={`${API_URL}/storage/${item.image}`} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{item.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">Qté: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold">{((item.discount_price || item.price) * item.quantity).toFixed(2)}€</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full disabled:opacity-50">
                {isSubmitting ? "Redirection..." : "Payer la commande"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}