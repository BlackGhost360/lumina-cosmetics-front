// src/pages/Contact.tsx
import React, { useState } from "react";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import { sendContact } from "../api/contact.api";

export default function Contact() {
  // 1. État du formulaire
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    subject: "Question sur un produit",
    message: "",
  });

  // 2. États de gestion UI
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // 3. Gestion des changements d'input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      await sendContact(form);
      
      setStatus({ type: "success", msg: "Votre message a été envoyé avec succès ! ✅" });
      // Réinitialisation du formulaire
      setForm({
        fullname: "",
        email: "",
        subject: "Question sur un produit",
        message: "",
      });
    } catch (err: any) {
      console.error(err);
      setStatus({ 
        type: "error", 
        msg: "Une erreur est survenue lors de l'envoi. Veuillez réessayer. ❌" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-serif font-bold text-[var(--text-primary)]">Contactez-nous</h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          Une question sur un produit ou sur votre commande ? Notre équipe est à votre écoute pour vous conseiller et vous accompagner.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-[var(--bg-primary)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center text-[var(--accent)] shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Email</h3>
                <p className="text-sm text-[var(--text-secondary)]">contact@cosmetiquehouse.com</p>
                <p className="text-xs text-[var(--text-secondary)]/60 mt-1">Réponse sous 24h ouvrées</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center text-[var(--accent)] shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Téléphone</h3>
                <p className="text-sm text-[var(--text-secondary)]">+33 1 23 45 67 89</p>
                <p className="text-xs text-[var(--text-secondary)]/60 mt-1">Lun - Ven, 9h - 18h</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center text-[var(--accent)] shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--text-primary)]">Boutique</h3>
                <p className="text-sm text-[var(--text-secondary)]">123 Avenue de la Beauté, 75008 Paris</p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--accent)] rounded-3xl p-8 text-white space-y-4">
            <h3 className="text-xl font-serif font-bold">Rejoignez la communauté</h3>
            <p className="text-sm text-white/80">Suivez-nous sur les réseaux sociaux pour découvrir nos nouveautés et conseils beauté.</p>
            <div className="flex gap-4 pt-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                <Instagram size={20} />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                <Facebook size={20} />
              </div>
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
                <Twitter size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <form 
            onSubmit={handleSubmit}
            className="bg-[var(--bg-primary)] rounded-3xl p-8 md:p-12 border border-[var(--border)] shadow-sm space-y-6"
          >
            {/* Affichage des messages de statut */}
            {status && (
              <div className={`p-4 rounded-xl text-sm font-medium ${
                status.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {status.msg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Nom complet</label>
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  required
                  type="text"
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  type="email"
                  placeholder="jean@exemple.com"
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Sujet</label>
              <select 
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              >
                <option value="Question sur un produit">Question sur un produit</option>
                <option value="Suivi de commande">Suivi de commande</option>
                <option value="Retour ou échange">Retour ou échange</option>
                <option value="Autre demande">Autre demande</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Comment pouvons-nous vous aider ?"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-12 py-4 bg-[var(--accent)] text-white font-bold rounded-full hover:bg-[var(--accent)]/90 transition-colors flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  Envoyer le message
                  <Send size={18} className="ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}