import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Tracking from "./pages/Tracking";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Legal from "./pages/Legal";
import Privacy from "./pages/Privacy";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import PageTransition from "./components/PageTransition";

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router basename="/lumina-cosmetics-front">
          <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-light)] transition-colors duration-300">
            <Navbar />

            <main className="pt-20">
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalogue" element={<Catalog />} />
                  <Route path="/produit/:id" element={<ProductDetail />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/commande" element={<Checkout />} />
                  <Route path="/confirmation/:orderId" element={<Confirmation />} />
                  <Route path="/suivi" element={<Tracking />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/mentions-legales" element={<Legal />} />
                  <Route path="/politique-confidentialite" element={<Privacy />} />
                </Routes>
              </PageTransition>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}