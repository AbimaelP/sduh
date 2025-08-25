// src/services/api.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:3000/api", // URL da API
  timeout: 10000, // tempo máximo de espera
  headers: {
    "Content-Type": "application/json",
  },
});

// export async function getToken() {
//   try {
//     const response = await api.post("/auth/token", {
//       client_id: import.meta.env.VITE_CLIENT_ID,
//       client_secret: import.meta.env.VITE_CLIENT_SECRET
//     });

//     return response.data.access_token;
//   } catch (error) {
//     console.error("Erro ao obter token:", error);
//     return null;
//   }
// }

// // api.interceptors.request.use(
// //   async (config) => {
// //     let token = localStorage.getItem("token");

// //     if (!token) {
// //       token = await getToken();
// //       if (token) {
// //         localStorage.setItem("token", token);
// //       }
// //     }

// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }

// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // api.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response?.status === 401) {
// //       console.error("Não autorizado, redirecionando para login...");
// //       // aqui pode fazer logout automático
// //     }
// //     return Promise.reject(error);
// //   }
// // );
