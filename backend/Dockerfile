# ----------------------------------------------------
# Dockerfile para o Backend (Node.js API)
# ----------------------------------------------------

# Estágio 1: Usar uma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências de produção
RUN npm install --only=production

# Copia o resto do código-fonte do backend
COPY . .

# Expõe a porta em que a aplicação vai rodar. O padrão do Cloud Run é 8080.
# Garanta que seu código (ex: app.listen(process.env.PORT || 8080)) use esta porta.
EXPOSE 3000

# Comando para iniciar o servidor quando o container for executado
# Troque 'server.js' pelo nome do seu arquivo de entrada (ex: index.js, app.js)
CMD [ "node", "server.js" ]