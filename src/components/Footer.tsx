import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold text-[var(--accent)]">
              <img 
                src={`${import.meta.env.BASE_URL}assets/images/logo.png`} 
                alt="Logo cosmetique House"
                height="50"
                width="110"
              />			
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Révélez votre éclat naturel avec nos soins cosmétiques d'exception, conçus avec passion et respect de la nature.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] mb-6">Boutique</h4>
            <ul className="space-y-3">
              <li><Link to="/catalogue" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">Tous les produits</Link></li>
              <li><Link to="/catalogue?cat=visage" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">Soins Visage</Link></li>
              <li><Link to="/catalogue?cat=corps" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">Soins Corps</Link></li>
              <li><Link to="/catalogue?cat=maquillage" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">Maquillage</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] mb-6">Aide</h4>
            <ul className="space-y-3">
              <li><Link to="/suivi" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">Suivre ma commande</Link></li>
              <li><Link to="/faq" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">Contact</Link></li>
              <li><Link to="/mentions-legales" className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)]">Mentions Légales</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] mb-6">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm text-[var(--text-secondary)]">
                <Mail size={16} className="text-[var(--accent)]" />
                <span>contact@cosmetiquehouse.com</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-[var(--text-secondary)]">
                <Phone size={16} className="text-[var(--accent)]" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-[var(--text-secondary)]">
                <MapPin size={16} className="text-[var(--accent)] mt-1 shrink-0" />
                <span>123 Avenue de la Beauté, 75008 Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} cosmetique House. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
