// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || "https://sduh-backend-914565622949.southamerica-east1.run.app", // URL da API
  timeout: 10000, // tempo máximo de espera
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.params = { ...config.params, token };
  }
  return config;
});

// Intercepta resposta para tratar erro 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se for erro 401 E não for a rota de login, tenta renovar
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("/auth/login")
    ) {
      try {
        // Pede um novo token ao backend
        const refreshResponse = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/empreendimentos/token`
        );

        const newToken = refreshResponse.data;
        if (newToken) {
          localStorage.setItem("token", newToken);

          // Tenta novamente a requisição original
          originalRequest.params = { 
            ...originalRequest.params, 
            token: newToken 
          };
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Se for login ou qualquer outro erro
    return Promise.reject(error);
  }
);


export default api;