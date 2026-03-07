import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw, Star } from "lucide-react";
import { Product, useCart } from "../context/CartContext";
import { motion } from "framer-motion";

// ✅ Import direct du JSON
import productsData from "../data/produits.json";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("description");

  // ✅ Recherche du produit optimisée avec useMemo
  const product = useMemo(() => {
    return (productsData as Product[]).find((p) => p.id === Number(id)) || null;
  }, [id]);

  // Si le produit n'existe pas, on affiche un message d'erreur
  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-xl font-serif text-[var(--text-secondary)]">Produit non trouvé.</p>
        <Link to="/catalogue" className="text-[var(--accent)] font-bold hover:underline">
          Retourner au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link 
        to="/catalogue" 
        className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-8 group"
      >
        <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" /> 
        Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/5] rounded-3xl overflow-hidden bg-[var(--bg-secondary)]"
          >
            <img
              src={`${import.meta.env.BASE_URL}${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="aspect-square rounded-xl overflow-hidden bg-[var(--bg-secondary)] cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              >
                <img src={`${import.meta.env.BASE_URL}${product.image}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--accent)]">
              {product.category}
            </p>
            <h1 className="text-4xl font-serif font-bold text-[var(--text-primary)]">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} fill={s <= 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm text-[var(--text-secondary)]">(24 avis clients)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {product.discount_price ? (
              <>
                <span className="text-3xl font-bold text-[var(--accent)]">
                  {product.discount_price.toFixed(2)}€
                </span>
                <span className="text-xl text-[var(--text-secondary)] line-through">
                  {product.price.toFixed(2)}€
                </span>
                <span className="bg-[var(--accent-light)] text-[var(--accent)] text-xs font-bold px-2 py-1 rounded">
                  PROMO
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-[var(--text-primary)]">
                {product.price.toFixed(2)}€
              </span>
            )}
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-4 pt-6 border-t border-[var(--border)]">
            <button
              onClick={() => addToCart(product)}
              className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:shadow-lg hover:brightness-110 transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingCart size={20} />
              <span>Ajouter au panier</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="pt-12">
            <div className="flex border-b border-[var(--border)] mb-6">
              {["description", "ingredients", "livraison"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors relative ${
                    activeTab === tab 
                      ? "text-[var(--accent)]" 
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {tab === "description" ? "Détails" : tab === "ingredients" ? "Ingrédients" : "Livraison"}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" 
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="text-sm text-[var(--text-secondary)] leading-relaxed min-h-[100px]">
              {activeTab === "description" && (
                <p>Ce produit {product.name.toLowerCase()} a été formulé pour répondre aux besoins spécifiques de votre peau. Sa texture légère pénètre rapidement sans laisser de film gras.</p>
              )}
              {activeTab === "ingredients" && (
                <p>{product.ingredients || "Liste des ingrédients non disponible pour ce produit."}</p>
              )}
              {activeTab === "livraison" && (
                <p>Livraison standard offerte dès 50€ d'achat. Expédition sous 24h. Retours gratuits sous 30 jours.</p>
              )}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[var(--border)]">
            <Badge icon={<ShieldCheck size={20} />} label="Paiement Sécurisé" />
            <Badge icon={<Truck size={20} />} label="Livraison Rapide" />
            <Badge icon={<RefreshCw size={20} />} label="Retours Faciles" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Petit composant interne pour les badges afin d'alléger le JSX
function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <div className="text-[var(--accent)]">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-tighter text-[var(--text-primary)]">
        {label}
      </span>
    </div>
  );
}