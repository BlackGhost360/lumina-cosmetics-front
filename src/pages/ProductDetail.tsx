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

  const product = useMemo(() => {
    return (productsData as Product[]).find((p) => p.id === Number(id)) || null;
  }, [id]);

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-4 text-center">
        <p className="text-xl font-serif text-[var(--text-secondary)]">Produit non trouvé.</p>
        <Link to="/catalogue" className="text-[var(--accent)] font-bold hover:underline mt-4">
          Retourner au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Bouton Retour - Plus compact sur mobile */}
      <Link 
        to="/catalogue" 
        className="inline-flex items-center text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-6 sm:mb-8 group"
      >
        <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" /> 
        Retour au catalogue
      </Link>

      {/* Grid Principal : 1 col sur mobile, 2 cols sur tablette/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Partie Gauche : Galerie Images */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--bg-secondary)]"
          >
            <img
              src={`${import.meta.env.BASE_URL}${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {/* Miniatures : Scroll horizontal sur mobile si trop d'images */}
          <div className="flex sm:grid sm:grid-cols-4 gap-3 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="w-20 h-20 sm:w-auto sm:aspect-square shrink-0 rounded-xl overflow-hidden bg-[var(--bg-secondary)] cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              >
                <img src={`${import.meta.env.BASE_URL}${product.image}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Partie Droite : Infos Produit */}
        <div className="flex flex-col">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-1">
                {product.category}
              </p>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill={s <= 4 ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-[var(--text-secondary)]">(24 avis)</span>
            </div>

            <div className="flex items-center space-x-3">
              {product.discount_price ? (
                <>
                  <span className="text-2xl sm:text-3xl font-bold text-[var(--accent)]">
                    {product.discount_price.toFixed(2)}€
                  </span>
                  <span className="text-lg sm:text-xl text-[var(--text-secondary)] line-through">
                    {product.price.toFixed(2)}€
                  </span>
                </>
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  {product.price.toFixed(2)}€
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {product.description}
            </p>

            <div className="pt-4">
              <button
                onClick={() => addToCart(product)}
                className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingCart size={20} />
                <span>Ajouter au panier</span>
              </button>
            </div>
          </div>

          {/* Onglets (Tabs) : Corrigés pour Mobile */}
          <div className="mt-10 sm:mt-12">
            <div className="flex border-b border-[var(--border)] overflow-x-auto no-scrollbar">
              {["description", "ingredients", "livraison"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors relative whitespace-nowrap ${
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
            <div className="py-6 text-sm text-[var(--text-secondary)] leading-relaxed min-h-[120px]">
              {activeTab === "description" && (
                <p>Ce produit {product.name.toLowerCase()} a été formulé pour répondre aux besoins spécifiques de votre peau. Sa texture légère pénètre rapidement sans laisser de film gras.</p>
              )}
              {activeTab === "ingredients" && (
                <p className="italic">{product.ingredients || "Liste des ingrédients non disponible."}</p>
              )}
              {activeTab === "livraison" && (
                <p>Livraison standard offerte dès 50€ d'achat. Expédition sous 24h. Retours gratuits sous 30 jours.</p>
              )}
            </div>
          </div>

          {/* Trust Badges : 1 ligne sur mobile, icônes plus petites */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-8 border-t border-[var(--border)] mt-auto">
            <Badge icon={<ShieldCheck size={18} />} label="Sécurisé" />
            <Badge icon={<Truck size={18} />} label="Rapide" />
            <Badge icon={<RefreshCw size={18} />} label="Retours" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-1">
      <div className="text-[var(--accent)]">{icon}</div>
      <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-tight text-[var(--text-primary)]">
        {label}
      </span>
    </div>
  );
}