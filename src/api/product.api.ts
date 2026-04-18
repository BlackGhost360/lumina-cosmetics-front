// src/api/prod/product.api.ts
import { useState, useEffect, useCallback } from "react";
import api from "./axios";

// --- TYPES ---

export interface Product {
  id: number;
  name: string;
  price: number;
  discount_price: number | null;
  description: string;
  image: string;
  ingredients: string;
  is_featured: boolean;
  is_new: boolean;
  brand: string;
  category: string;
  created_by: string;
  created_at: string;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedProducts {
  data: Product[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: PaginationMeta;
}

// --- CONFIGURATION DU CACHE ---

const CACHE_KEY = "app_products_data";
const CACHE_TIMESTAMP_KEY = "app_products_last_fetch";

// --- FONCTIONS API ---

/**
 * Récupère une page de produits depuis l'API
 */
export const getProducts = (page = 1) => {
  return api.get<PaginatedProducts>(`/products?page=${page}`);
};

// --- HOOK PERSONNALISÉ ---

/**
 * 🔁 Hook React pour récupérer tous les produits avec Cache LocalStorage
 * @param delay Temps avant expiration du cache (par défaut 30 minutes)
 */
export const useAllProductsAuto = (delay = 1800000) => {
  // 1. Initialisation de l'état avec le contenu du LocalStorage (si présent)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(CACHE_KEY);
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  /**
   * Logique de récupération de TOUTES les pages de produits
   * @param force Si true, ignore le cache et force l'appel API
   */
  const fetchAllProducts = useCallback(async (force = false) => {
    const now = Date.now();
    const lastFetch = Number(localStorage.getItem(CACHE_TIMESTAMP_KEY)) || 0;

    // 2. Vérification de la validité du cache
    // On ne lance l'API que si :
    // - On force le refresh (ex: bouton refresh ou intervalle)
    // - OU la liste est vide
    // - OU le cache a expiré (now - lastFetch > delay)
    if (!force && products.length > 0 && (now - lastFetch) < delay) {
      return;
    }

    setLoading(true);
    setError(null);

    let accumulatedProducts: Product[] = [];
    let currentPage = 1;

    try {
      while (true) {
        const response = await getProducts(currentPage);
        const { data, meta } = response.data;

        accumulatedProducts = [...accumulatedProducts, ...data];

        // Arrêt si on a atteint la dernière page
        if (!meta || currentPage >= meta.last_page) break;
        currentPage++;
      }

      // 3. Mise à jour de l'état et stockage persistant
      setProducts(accumulatedProducts);
      localStorage.setItem(CACHE_KEY, JSON.stringify(accumulatedProducts));
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      
    } catch (err) {
      console.error("Erreur API Produits:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [products.length, delay]);

  // 4. Gestion du cycle de vie (Fetch initial et Intervalle)
  useEffect(() => {
    // Vérification automatique au montage du composant
    fetchAllProducts();

    // Rafraîchissement automatique en arrière-plan
    const interval = setInterval(() => {
      fetchAllProducts(true);
    }, delay);

    return () => clearInterval(interval);
  }, [fetchAllProducts, delay]);

  return { 
    products, 
    loading: products.length === 0 && loading, // N'affiche loading que si on n'a vraiment rien à montrer
    error, 
    refresh: () => fetchAllProducts(true) 
  };
};