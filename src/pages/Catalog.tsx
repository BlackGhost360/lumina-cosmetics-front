// src/pages/Catalog.tsx
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Import direct du JSON depuis src/data
import productsData from "../data/produits.json";

export default function Catalog() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("cat") || "Tous");
  const [priceRange, setPriceRange] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const productsRef = useRef<HTMLDivElement>(null);

  const PRODUCTS_PER_PAGE = 6;
  const categories = ["Tous", "Soins visage", "Soins corps", "Maquillage", "Parfums"];

  // ✅ Charger les produits depuis le JSON importé
  useEffect(() => {
    setAllProducts(productsData);
    setIsLoading(false);
  }, []);

  // Filtrage + recherche + pagination
  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategory !== "Tous") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter((p) => (p.discount_price || p.price) <= priceRange);

    setTotalProducts(filtered.length);

    // Pagination
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const paginated = filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    setDisplayProducts(paginated);
  }, [allProducts, selectedCategory, searchQuery, priceRange, currentPage]);

  // Reset page à 1 quand filtre change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, priceRange]);

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
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
          className="p-2 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && handlePageChange(page)}
            className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
              page === currentPage
                ? "bg-[var(--accent)] text-white"
                : page === "..."
                ? "cursor-default text-[var(--text-secondary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] mb-6 flex items-center">
              <Filter size={16} className="mr-2" /> Filtres
            </h3>

            {/* Search */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)] transition-colors text-sm text-[var(--text-primary)]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Catégories</h4>
              <div className="flex flex-col space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left text-sm py-1 transition-colors ${
                      selectedCategory === cat
                        ? "text-[var(--accent)] font-bold"
                        : "text-[var(--text-secondary)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-8 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                Prix Max: {priceRange}€
              </h4>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8" ref={productsRef}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-serif font-bold text-[var(--text-primary)]">
              {selectedCategory === "Tous" ? "Tous les produits" : selectedCategory}
              <span className="ml-3 text-sm font-normal text-[var(--text-secondary)]">
                ({totalProducts} produits)
              </span>
            </h1>
            <div className="flex items-center text-sm text-[var(--text-secondary)] cursor-pointer hover:text-[var(--accent)]">
              <SlidersHorizontal size={16} className="mr-2" /> Trier par
            </div>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${
              isLoading ? "opacity-50" : "opacity-100"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {displayProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {displayProducts.length === 0 && !isLoading && (
            <div className="text-center py-24">
              <p className="text-gray-500 text-lg">Aucun produit ne correspond à vos critères.</p>
              <button
                onClick={() => {
                  setSelectedCategory("Tous");
                  setSearchQuery("");
                  setPriceRange(100);
                }}
                className="mt-4 text-[#5A5A40] font-bold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {totalPages > 1 && renderPagination()}
        </main>
      </div>
    </div>
  );
}