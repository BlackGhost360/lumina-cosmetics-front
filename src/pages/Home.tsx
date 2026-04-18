// src/pages/Home.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Truck, Sparkles } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useTheme } from "../context/ThemeContext";

// ✅ Import du hook API et du type
import { useAllProductsAuto, Product } from "../api/product.api";

export default function Home() {
  const { theme } = useTheme();

  // ✅ Utilisation de l'API au lieu de l'import JSON direct
  const { products: allProducts, loading: isLoading } = useAllProductsAuto();

  // ✅ Filtrage des produits "featured" via useMemo
  const featuredProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.is_featured)
      .slice(0, 4); // On en prend 4 pour la grille home
  }, [allProducts]);

  const heroImage =
    theme === "light"
      ? `${import.meta.env.BASE_URL}assets/images/banner-light.jpg`
      : `${import.meta.env.BASE_URL}assets/images/banner-dark.jpg`;

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            key={heroImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={heroImage}
            alt="Hero Cosmetics"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-sm font-bold uppercase tracking-widest mb-4 text-[#E6D5C3]">
              Nouvelle Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6">
              Révélez votre <br />
              <span className="italic">Éclat Naturel</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100 leading-relaxed">
              Des soins purs, éthiques et performants pour sublimer votre beauté au quotidien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalogue"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-[#E6D5C3] transition-colors group"
              >
                Découvrir la boutique
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--accent)]">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-lg font-bold">100% Naturel</h3>
            <p className="text-sm text-[var(--text-secondary)]">Ingrédients sourcés de manière éthique et durable.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--accent)]">
              <Truck size={32} />
            </div>
            <h3 className="text-lg font-bold">Livraison Express</h3>
            <p className="text-sm text-[var(--text-secondary)]">Expédition sous 24h pour toutes vos commandes.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center text-[var(--accent)]">
              <Star size={32} />
            </div>
            <h3 className="text-lg font-bold">Qualité Premium</h3>
            <p className="text-sm text-[var(--text-secondary)]">Testé dermatologiquement pour tous types de peaux.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 sm:mb-12">
          <div className="max-w-md">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--text-primary)] mb-2 leading-tight">
              Produits en Vedette
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">
              Nos best-sellers plébiscités par nos clients.
            </p>
          </div>

          <Link 
            to="/catalogue" 
            className="text-[var(--accent)] font-bold hover:underline flex items-center text-sm sm:text-base whitespace-nowrap self-start md:self-auto"
          >
            Voir tout <ArrowRight size={16} className="ml-1 shrink-0" />
          </Link>
        </div>

        {/* ✅ Grille avec Logique de Chargement (Skeletons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            // Affichage des Skeletons pendant le chargement
            [...Array(4)].map((_, i) => (
              <div key={`skeleton-home-${i}`} className="animate-pulse bg-[var(--bg-secondary)] rounded-2xl h-[400px] w-full flex flex-col p-4 space-y-4">
                <div className="bg-[var(--border)] rounded-xl h-2/3 w-full" />
                <div className="space-y-2">
                  <div className="bg-[var(--border)] h-4 w-3/4 rounded" />
                  <div className="bg-[var(--border)] h-4 w-1/2 rounded" />
                </div>
                <div className="bg-[var(--border)] h-10 w-full rounded-xl mt-auto" />
              </div>
            ))
          ) : (
            // Affichage des produits réels une fois chargés
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[var(--accent)] text-white p-8 md:p-24 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="flex-1 space-y-6 w-full text-center lg:text-left z-10">
            <div className="inline-flex items-center space-x-2 text-[var(--accent-light)]">
              <Sparkles size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Offre Spéciale</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
              -15% sur votre première commande
            </h2>
            
            <p className="text-base md:text-lg text-gray-200 max-w-lg mx-auto lg:mx-0">
              Inscrivez-vous à notre newsletter et recevez un code promo exclusif.
            </p>

            <form 
              onSubmit={(e) => e.preventDefault()} 
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto lg:mx-0"
            >
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:bg-white/20 transition-colors text-center sm:text-left"
              />
              <button 
                type="submit" 
                className="px-8 py-4 bg-white text-[var(--accent)] font-bold rounded-full hover:bg-[var(--accent-light)] transition-all active:scale-95 whitespace-nowrap"
              >
                S'inscrire
              </button>
            </form>
          </div>

          <div className="flex-1 w-full max-w-sm lg:max-w-none">
            <img
              src={`${import.meta.env.BASE_URL}assets/images/PromoBanner.avif`} 
              alt="Promo"
              className="rounded-2xl shadow-2xl rotate-0 md:rotate-3 hover:rotate-0 transition-transform duration-500 w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}