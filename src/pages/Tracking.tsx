import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Order {
  id: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
  address: string;
  city: string;
  items: any[];
}

export default function Tracking() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e?: any) => {
    if (e) e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError("");
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const found = orders.find((o: any) => o.id === orderId);
      
      if (!found) throw new Error("Commande non trouvée");
      
      // Adapt structure if necessary
      setOrder({
        ...found,
        customer_name: found.customer.firstName + " " + found.customer.lastName,
        address: found.customer.address,
        city: found.customer.city,
        items: found.items.map((item: any) => ({
          ...item,
          product_image: item.image // Ensure image property matches
        }))
      });
    } catch (err: any) {
      setError(err.message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("orderId")) {
      handleSearch();
    }
  }, []);

  const statuses = [
    { name: "En attente", icon: <Clock size={20} />, color: "bg-yellow-500" },
    { name: "En préparation", icon: <Package size={20} />, color: "bg-blue-500" },
    { name: "Expédiée", icon: <Truck size={20} />, color: "bg-purple-500" },
    { name: "Livrée", icon: <CheckCircle2 size={20} />, color: "bg-green-500" },
  ];

  const currentStatusIndex = statuses.findIndex(s => s.name === order?.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-serif font-bold text-[var(--text-primary)]">Suivi de commande</h1>
        <p className="text-[var(--text-secondary)]">Entrez votre numéro de commande pour connaître son état d'avancement.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-16">
        <div className="relative">
          <input
            type="text"
            placeholder="Ex: ORD-ABC123XYZ"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
            className="w-full pl-12 pr-32 py-4 bg-[var(--bg-primary)] border border-[var(--border)] rounded-full focus:outline-none focus:border-[var(--accent)] shadow-sm text-[var(--text-primary)]"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Suivre"}
          </button>
        </div>
        {error && (
          <p className="mt-4 text-sm text-red-500 flex items-center justify-center">
            <AlertCircle size={14} className="mr-1" /> {error}
          </p>
        )}
      </form>

      {/* Order Details */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Status Stepper */}
          <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
              {/* Progress Line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-[var(--bg-secondary)] -translate-y-1/2 z-0">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
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
                  <span className={`text-xs font-bold uppercase tracking-widest ${
                    index <= currentStatusIndex ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                  }`}>
                    {status.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info */}
            <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Détails de la commande</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Client</span>
                  <span className="font-bold text-[var(--text-primary)]">{order.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Date</span>
                  <span className="font-bold text-[var(--text-primary)]">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Total</span>
                  <span className="font-bold text-[var(--accent)]">{order.total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Adresse</span>
                  <span className="font-bold text-[var(--text-primary)] text-right">{order.address}, {order.city}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Articles</h2>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.product_image} alt="" className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--text-primary)] truncate">{item.name}</p>
                      <p className="text-xs text-[var(--text-secondary)]">Qté: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--text-primary)]">{item.price.toFixed(2)}€</span>
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
