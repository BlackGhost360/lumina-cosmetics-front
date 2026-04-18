import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { getOrderByNumber, OrderDetail } from "../api/order.api";

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL_BASE;

  const handleSearch = async (e?: any) => {
    if (e) e.preventDefault();
    if (!orderId || !email) {
      setError("Veuillez remplir le numéro de commande et l'email.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Appel à l'API réelle définie dans order.api.ts
      const data = await getOrderByNumber(orderId, email);
      setOrder(data);
    } catch (err: any) {
      // On récupère le message d'erreur lancé par le switch case de getOrderByNumber
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // Lancement automatique si les params sont dans l'URL (ex: retour de mail)
  useEffect(() => {
    if (searchParams.get("orderId") && searchParams.get("email")) {
      handleSearch();
    }
  }, []);

  const statuses = [
    { name: "En attente", icon: <Clock size={20} />, id: "pending" },
    { name: "En préparation", icon: <Package size={20} />, id: "processing" },
    { name: "Expédiée", icon: <Truck size={20} />, id: "shipped" },
    { name: "Livrée", icon: <CheckCircle2 size={20} />, id: "delivered" },
  ];

  // Logique pour trouver l'index actuel basé sur le status retourné par l'API
  // Adapte "order.status" selon les strings exactes renvoyées par ton backend
  const currentStatusIndex = statuses.findIndex(s => s.name.toLowerCase() === order?.status.toLowerCase() || s.id === order?.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)]">Suivi de commande</h1>
        <p className="text-[var(--text-secondary)]">Saisissez vos informations pour localiser votre colis.</p>
      </div>

      {/* Formulaire de recherche double (ID + Email) */}
      <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="N° de commande (ex: ORD-123)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value.toUpperCase())}
              className="w-full pl-12 pr-4 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[var(--accent)] shadow-sm text-[var(--text-primary)]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[var(--accent)] shadow-sm text-[var(--text-primary)]"
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-2xl hover:bg-[var(--accent)]/90 transition-all disabled:opacity-50 shadow-lg shadow-[var(--accent)]/20"
        >
          {loading ? "Recherche en cours..." : "Rechercher la commande"}
        </button>

        {error && (
          <motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm text-red-500 flex items-center justify-center">
            <AlertCircle size={14} className="mr-1" /> {error}
          </motion.p>
        )}
      </form>

      {/* Détails de la commande */}
      {order && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* Stepper de Progression */}
          <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--bg-secondary)] -translate-y-1/2 z-0">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, (currentStatusIndex / (statuses.length - 1)) * 100)}%` }}
                  className="h-full bg-[var(--accent)]"
                />
              </div>

              {statuses.map((status, index) => (
                <div key={status.name} className="relative z-10 flex flex-col items-center space-y-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    index <= currentStatusIndex ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                  }`}>
                    {status.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    index <= currentStatusIndex ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                  }`}>
                    {status.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informations client et commande */}
            <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Informations</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[var(--text-secondary)]">Commande</span>
                  <span className="font-bold text-[var(--text-primary)]">#{order.order_number}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[var(--text-secondary)]">Destinataire</span>
                  <span className="font-bold text-[var(--text-primary)]">{order.customer.name} {order.customer.surname}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[var(--text-secondary)]">Date</span>
                  <span className="font-bold text-[var(--text-primary)]">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between border-b border-[var(--border)] pb-2">
                  <span className="text-[var(--text-secondary)]">Livraison</span>
                  <span className="font-bold text-[var(--text-primary)] text-right">{order.customer.address}, {order.customer.city}</span>
                </div>
                <div className="flex justify-between pt-2 text-lg">
                  <span className="text-[var(--text-secondary)]">Total</span>
                  <span className="font-bold text-[var(--accent)]">{order.total_price}€</span>
                </div>
              </div>
            </div>

            {/* Liste des articles */}
            <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Articles ({order.items.length})</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[var(--bg-secondary)] shrink-0">
                      <img 
                        src={`${API_URL}/storage/${item.image}`} 
                        alt={item.product_name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">{item.product_name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">Quantité: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{item.total}€</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}