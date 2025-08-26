// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:3000/api", // URL da API
  timeout: 10000, // tempo máximo de espera
  headers: {
    "Content-Type": "application/json",
  },
});
;

// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.params = { ...config.params, token };
  }
  return config;
});

// Intercepta resposta para tratar erro 403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Pede um novo token ao backend
      const refreshResponse = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/empreendimentos/token`
      );

      const newToken = refreshResponse.data;
      if (newToken) {
        localStorage.setItem("token", newToken);

        // Tenta novamente a requisição original
        error.config.params = { 
          ...error.config.params, 
          token: newToken 
        };
        return api(error.config);
      }
    }

    return Promise.reject(error);
  }
);


export default api;