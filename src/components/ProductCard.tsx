import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Product, useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export default function ProductCard({ product }: { product: Product, key?: any }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-[var(--bg-primary)] rounded-2xl overflow-hidden shadow-sm border border-[var(--border)] transition-all hover:shadow-xl"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.is_new && (
            <span className="bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Nouveau
            </span>
          )}
          {product.discount_price && (
            <span className="bg-[var(--accent-light)] text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Promo
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <Link
            to={`/produit/${product.id}`}
            className="w-12 h-12 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-colors"
          >
            <Eye size={20} />
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="w-12 h-12 bg-[var(--bg-primary)] rounded-full flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-2">
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
            {product.brand}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">
            {product.category}
          </p>
        </div>
        <Link to={`/produit/${product.id}`}>
          <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          {product.discount_price ? (
            <>
              <span className="text-lg font-bold text-[var(--accent)]">{product.discount_price.toFixed(2)}€</span>
              <span className="text-sm text-[var(--text-secondary)] line-through">{product.price.toFixed(2)}€</span>
            </>
          ) : (
            <span className="text-lg font-bold text-[var(--text-primary)]">{product.price.toFixed(2)}€</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
