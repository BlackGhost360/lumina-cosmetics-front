// src/pages/Catalog.tsx
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Search, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { Product } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

// Import direct du JSON
import productsData from "../data/produits.json";

export default function Catalog() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchParams] = useSearchParams();
  
  // États des filtres
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("cat") ? [searchParams.get("cat")!] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  
  // États UI
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  
  const productsRef = useRef<HTMLDivElement>(null);
  const PRODUCTS_PER_PAGE = 6;
  const categoriesList = ["Soins visage", "Soins corps", "Maquillage", "Parfums"];

  // 1. Initialisation
  useEffect(() => {
    const data = productsData as Product[];
    setAllProducts(data);
    const uniqueBrands = Array.from(new Set(data.map(p => p.brand))).sort();
    setBrands(uniqueBrands);
    setIsLoading(false);
  }, []);

  // 2. Filtrage
  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => 
        selectedCategories.some(cat => p.category.toLowerCase().includes(cat.toLowerCase()))
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query)
      );
    }

    filtered = filtered.filter(p => (p.discount_price || p.price) <= priceRange);
    setTotalProducts(filtered.length);

    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    setDisplayProducts(filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE));
  }, [allProducts, selectedCategories, selectedBrands, searchQuery, priceRange, currentPage]);

  // Reset page
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedBrands, searchQuery, priceRange]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  // --- LOGIQUE DE PAGINATION COMPLEXE ---
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPaginationButtons = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-16">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
              page === currentPage
                ? "bg-[var(--accent)] text-white shadow-md"
                : page === "..."
                ? "cursor-default text-[var(--text-secondary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--accent)]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between md:block">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] mb-6 flex items-center">
          <Filter size={16} className="mr-2" /> Filtres
        </h3>
        <button onClick={() => setShowMobileFilters(false)} className="md:hidden p-2"><X size={24} /></button>
      </div>

      <div className="relative">
        <input
          type="text" placeholder="Rechercher..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] text-sm"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
      </div>

      {/* Catégories Checkboxes */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Catégories</h4>
        <div className="flex flex-col space-y-3">
          {categoriesList.map((cat) => (
            <label key={cat} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox" checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="peer appearance-none w-5 h-5 border-2 border-[var(--border)] rounded-md checked:bg-[var(--accent)] checked:border-[var(--accent)] transition-all cursor-pointer"
                />
                <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none" />
              </div>
              <span className={`ml-3 text-sm transition-colors ${selectedCategories.includes(cat) ? "text-[var(--accent)] font-bold" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Marques Checkboxes */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Marques</h4>
        <div className="flex flex-col space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center group cursor-pointer">
              <div className="relative flex items-center">
                <input
                  type="checkbox" checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="peer appearance-none w-5 h-5 border-2 border-[var(--border)] rounded-md checked:bg-[var(--accent)] checked:border-[var(--accent)] transition-all cursor-pointer"
                />
                <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none" />
              </div>
              <span className={`ml-3 text-sm transition-colors ${selectedBrands.includes(brand) ? "text-[var(--accent)] font-bold" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Prix Max: {priceRange}€</h4>
        <input
          type="range" min="0" max="350" step="5" value={priceRange}
          onChange={(e) => setPriceRange(parseInt(e.target.value))}
          className="w-full accent-[var(--accent)] cursor-pointer"
        />
      </div>

      <button
        onClick={() => { setSelectedCategories([]); setSelectedBrands([]); setSearchQuery(""); setPriceRange(100); }}
        className="w-full py-2 text-xs font-bold uppercase tracking-widest text-[var(--accent)] border border-[var(--accent)] rounded-xl hover:bg-[var(--accent)] hover:text-white transition-all"
      >
        Réinitialiser
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => setShowMobileFilters(true)} className="md:hidden w-full mb-6 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl font-bold flex justify-center items-center gap-2">
        <Filter size={18} /> Filtres
      </button>

      <div className="flex flex-col md:flex-row gap-12">
        <aside className="hidden md:block w-64 shrink-0"><FilterContent /></aside>

        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileFilters(false)} className="fixed inset-0 bg-black/50 z-[100] md:hidden" />
              <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[var(--bg-primary)] z-[101] p-6 overflow-y-auto md:hidden shadow-2xl">
                <FilterContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-serif font-bold text-[var(--text-primary)] uppercase tracking-tight">
              Catalogue <span className="ml-2 text-sm font-normal text-[var(--text-secondary)]">({totalProducts} produits)</span>
            </h1>
            <div className="flex items-center text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--accent)] transition-colors">
              <SlidersHorizontal size={16} className="mr-2" /> Trier
            </div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity ${isLoading ? "opacity-50" : "opacity-100"}`}>
            <AnimatePresence mode="popLayout">
              {displayProducts.map((product) => (
                <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {displayProducts.length === 0 && !isLoading && (
            <div className="text-center py-24 text-[var(--text-secondary)] italic">Aucun produit trouvé.</div>
          )}

          {totalPages > 1 && renderPaginationButtons()}
        </main>
      </div>
    </div>
  );
}