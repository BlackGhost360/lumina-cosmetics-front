import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 60000, //10S
});

// ✅ Interceptor request
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Erreur réseau");
    }

    if (error.response?.status === 500) {
      console.error("Erreur serveur");
    }

    if (error.response?.status === 422) {
      console.error("Erreur validation", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
