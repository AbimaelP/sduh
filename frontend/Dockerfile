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

ENV VITE_API_URL="https://empreendimentos-api-914565622949.southamerica-east1.run.app/public"
ENV VITE_CLIENT_ID="horushab"
ENV VITE_CLIENT_SECRET="819ea51612a11abbca8d5f12667ac84b7658bb1efb63ade48ba27afbbdd28113"
ENV VITE_APP_BACKEND_URL="https://sduh-backend-914565622949.southamerica-east1.run.app"
ENV VITE_GOOGLE_MAPS_API_KEY="AIzaSyCK1WTYiu5zg8Sw0E79aubZQ_HZ1dbLf8I"
ENV VITE_GOOGLE_MAPS_API_KEY_DEV="AIzaSyCVUn13ipUTxghQqg9j8PiooToVqRqIGP8I"


# Build do Vite (ele vai substituir import.meta.env.* pelas variáveis acima)
RUN npm run build

# ----------------------------------------------------
# Estágio 2: Servidor de Produção (Nginx)
# ----------------------------------------------------
FROM nginx:stable-alpine

# Copia os arquivos gerados no estágio de build para a pasta padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia a configuração personalizada do Nginx para lidar com rotas de SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]