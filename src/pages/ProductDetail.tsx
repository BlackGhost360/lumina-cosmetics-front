// src/pages/ProductDetail.tsx
import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCw, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Import du hook API et des types
import { useAllProductsAuto } from "../api/product.api";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("description");

  // ✅ Récupération des données via l'API
  const { products: allProducts, loading: isLoading } = useAllProductsAuto();
  
  const API_URL = import.meta.env.VITE_API_URL_BASE;

  // ✅ Recherche du produit spécifique
  const product = useMemo(() => {
    return allProducts.find((p) => p.id === Number(id)) || null;
  }, [allProducts, id]);

  // --- ÉTAT DE CHARGEMENT (SKELETON) ---
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 animate-pulse">
        <div className="h-4 w-32 bg-[var(--bg-secondary)] rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          <div className="aspect-[4/5] bg-[var(--bg-secondary)] rounded-3xl" />
          <div className="space-y-6">
            <div className="h-4 w-20 bg-[var(--bg-secondary)] rounded" />
            <div className="h-10 w-3/4 bg-[var(--bg-secondary)] rounded" />
            <div className="h-6 w-24 bg-[var(--bg-secondary)] rounded" />
            <div className="h-24 w-full bg-[var(--bg-secondary)] rounded-xl" />
            <div className="h-14 w-full bg-[var(--bg-secondary)] rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // --- ÉTAT PRODUIT INTROUVABLE ---
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
      {/* Bouton Retour */}
      <Link 
        to="/catalogue" 
        className="inline-flex items-center text-xs sm:text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-6 sm:mb-8 group"
      >
        <ArrowLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" /> 
        Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Partie Gauche : Galerie Images */}
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--bg-secondary)] shadow-sm"
          >
            <img
              src={`${API_URL}/storage/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Miniatures (Simulées avec l'image principale) */}
          <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible no-scrollbar">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="w-20 h-20 sm:w-auto sm:aspect-square shrink-0 rounded-xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border)] cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              >
                <img 
                   src={`${API_URL}/storage/${product.image}`} 
                   alt={`${product.name} view ${i}`} 
                   className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Partie Droite : Infos Produit */}
        <div className="flex flex-col">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
                  {product.brand}
                </span>
                <span className="text-[10px] sm:text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] px-2 py-1 bg-[var(--bg-secondary)] rounded-md">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--text-primary)] leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-3">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill={s <= 4 ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-sm text-[var(--text-secondary)] font-medium">(24 avis clients)</span>
              </div>
            </div>

            <div className="flex items-baseline space-x-3">
              {product.discount_price ? (
                <>
                  <span className="text-3xl font-bold text-[var(--accent)]">
                    {product.discount_price.toFixed(2)}€
                  </span>
                  <span className="text-xl text-[var(--text-secondary)] line-through">
                    {product.price.toFixed(2)}€
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-[var(--text-primary)]">
                  {product.price.toFixed(2)}€
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--border)] pl-4 italic">
              {product.description}
            </p>

            <button
              onClick={() => addToCart(product)}
              className="w-full py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
            >
              <ShoppingCart size={20} />
              <span>AJOUTER AU PANIER</span>
            </button>

            {/* Onglets (Tabs) */}
            <div className="mt-8 pt-8 border-t border-[var(--border)]">
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
                        layoutId="activeTabIndicator" 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" 
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="py-6 text-sm text-[var(--text-secondary)] leading-relaxed min-h-[100px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "description" && (
                      <p>Le soin <strong>{product.name}</strong> a été formulé pour répondre aux exigences des peaux les plus délicates. Sa texture sensorielle garantit un confort immédiat et durable.</p>
                    )}
                    {activeTab === "ingredients" && (
                      <p className="italic leading-loose">
                        {product.ingredients || "Aqua (Water), Glycerin, Squalane, Cetearyl Alcohol, Hyaluronic Acid, Tocopherol, Ethylhexylglycerin..."}
                      </p>
                    )}
                    {activeTab === "livraison" && (
                      <ul className="space-y-2">
                        <li className="flex items-center">📦 Livraison Colissimo sous 2-3 jours ouvrés.</li>
                        <li className="flex items-center">✨ Échantillons offerts dans chaque commande.</li>
                        <li className="flex items-center">🔄 Retours facilités sous 30 jours.</li>
                      </ul>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border)]">
              <Badge icon={<ShieldCheck size={20} />} label="Paiement Sécurisé" />
              <Badge icon={<Truck size={20} />} label="Livraison Offerte" />
              <Badge icon={<RefreshCw size={20} />} label="Retours 30j" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-2 group">
      <div className="text-[var(--accent)] transition-transform group-hover:scale-110 duration-300">
        {icon}
      </div>
      <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[var(--text-primary)]">
        {label}
      </span>
    </div>
  );
}