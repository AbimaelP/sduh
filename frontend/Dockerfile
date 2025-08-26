# ----------------------------------------------------
# Dockerfile para o Frontend (React + Vite)
# ----------------------------------------------------

# Estágio 1: Build da Aplicação
FROM node:18-alpine AS build
WORKDIR /app

# Copia os arquivos de definição de pacotes
COPY package.json package-lock.json ./

RUN npm install

COPY . .

# Define variáveis de build para Vite
ARG VITE_API_URL
ARG VITE_CLIENT_ID
ARG VITE_CLIENT_SECRET
ARG VITE_APP_BACKEND_URL
ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_GOOGLE_MAPS_API_KEY_DEV

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLIENT_ID=$VITE_CLIENT_ID
ENV VITE_CLIENT_SECRET=$VITE_CLIENT_SECRET
ENV VITE_APP_BACKEND_URL=$VITE_APP_BACKEND_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_API_KEY_DEV=$VITE_GOOGLE_MAPS_API_KEY_DEV

# Build do Vite (ele vai substituir import.meta.env.* pelas variáveis acima)
RUN npm run build

# ----------------------------------------------------
# Estágio 2: Servidor de Produção (Nginx)
# ----------------------------------------------------
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]