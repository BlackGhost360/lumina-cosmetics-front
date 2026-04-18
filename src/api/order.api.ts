import api from "./axios";

// 🔹 Item de commande
export interface OrderItem {
  product_id: number;
  quantity: number;
}

// 🔹 Paiement carte
export interface CardPayment {
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
}

// 🔹 Payload complet
export interface OrderPayload {
  customer_name: string;
  customer_surname: string;
  customer_email: string;
  customer_phone: string;
  customer_country: string;
  customer_city: string;
  customer_address: string;

  payment_method: "card"; // ✅ uniquement carte pour l’instant
  card: CardPayment;       // obligatoire

  items: OrderItem[];
}

// 🔹 Customer GET METHOD
export interface OrderCustomer {
  name: string;
  surname: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
}

// 🔹 Item retourné
export interface OrderDetailItem {
  product_name: string;
  quantity: number;
  unit_price: string;
  total: number;
  image: string;
}

// 🔹 Order detail response
export interface OrderDetail {
  order_number: string;
  status: string;
  total_price: string;
  customer: OrderCustomer;
  items: OrderDetailItem[];
  created_at: string;
}


// 🔹 POST /orders
export const createOrder = (data: OrderPayload) => {
  return api.post("/orders", {
    ...data,
    // on aplatit les infos carte pour backend
    card_number: data.card.card_number,
    cvv: data.card.cvv,
    expiry_month: data.card.expiry_month,
    expiry_year: data.card.expiry_year,
  });
};


// 🔹 GET /orders/{order_number}?email=...
export const getOrderByNumber = async (orderNumber: string, email: string) => {
  try {
    const res = await api.get<OrderDetail>(`/orders/${orderNumber}`, {
      params: { email }
    });

    return res.data;

  } catch (err: any) {
    // 🔴 Gestion des erreurs backend
    if (err.response) {
      const status = err.response.status;

      switch (status) {
        case 404:
          throw new Error("Commande introuvable");
        case 403:
          throw new Error("Email incorrect pour cette commande");
        case 422:
          throw new Error("Données invalides");
        case 500:
          throw new Error("Erreur serveur, réessayez plus tard");
        default:
          throw new Error("Une erreur est survenue");
      }
    }

    // 🔴 Pas de réponse (réseau, serveur down…)
    if (err.request) {
      throw new Error("Impossible de contacter le serveur");
    }

    // 🔴 Autre erreur
    throw new Error(err.message || "Erreur inconnue");
  }
};