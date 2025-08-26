# ----------------------------------------------------
# Dockerfile para o Frontend (React + Vite)
# ----------------------------------------------------

# Estágio 1: Build da Aplicação
# Usamos uma imagem Node.js para instalar dependências e construir os arquivos estáticos.
FROM node:18-alpine AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de definição de pacotes
COPY package.json ./
COPY package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código da sua aplicação para o container
COPY . .

# Executa o comando de build para gerar a versão de produção
RUN npm run build

# Estágio 2: Servidor de Produção
# Usamos uma imagem Nginx super leve para servir os arquivos gerados.
FROM nginx:stable-alpine

# Copia os arquivos da pasta 'build' do estágio anterior para a pasta padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Nota: Se o seu comando `npm run build` cria uma pasta chamada 'build' em vez de 'dist', mude a linha acima para:
# COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80, que é a porta padrão do Nginx
EXPOSE 80

# Comando que inicia o servidor Nginx quando o container é executado
CMD ["nginx", "-g", "daemon off;"]