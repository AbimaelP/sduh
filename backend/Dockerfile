# ----------------------------------------------------
# Dockerfile para o Backend (Node.js API)
# ATENÇÃO: Contém segredos. Não use em produção.
# ----------------------------------------------------

# Estágio 1: Usar uma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Define as variáveis de ambiente para a aplicação

ENV GOV_OPENID_CONFIGURATION="https://rhsso.idp-hml.sp.gov.br/auth/realms/idpsp/.well-known/openid-configuration"
ENV APP_SHEET_URL="https://api.appsheet.com/api/v2/apps/52ad0add-0bbe-4112-8146-272f5494103a"
ENV APP_SHEET_KEY="V2-xBhdP-ga0B7-nZiek-ACxio-SE1aF-YifT8-wRGfu-i6LeE"
ENV API_URL="https://empreendimentos-api-914565622949.southamerica-east1.run.app/public"
ENV CLIENT_ID="horushab"
ENV SECRET="819ea51612a11abbca8d5f12667ac84b7658bb1efb63ade48ba27afbbdd28113"
ENV REDIRECT_URL="https://homologacao.horushab.habitacao.sp.gov.br/callback"
ENV GOV_CLIENT_ID="sduh.horus-hab"
ENV GOV_CLIENT_SECRET="3de8bc40-b5a0-4e18-b411-de473aefc725"
ENV SESSION_SECRET="sdasiuq231231sad"
ENV PORT="3000" 
ENV CODE_VERIFIER="uudliovupEodE4c7TPIYl0pXsEfGE_d0ki_09XdI9kg"
ENV DB_NAME="appsheet"
ENV DB_USER="besolution"
ENV DB_PASSWORD="P<x8k&lq5K+3<k##"
ENV DB_HOST="/cloudsql/sduh-hom:southamerica-east1:geoserver"
ENV DB_PORT="5432"

# Copia os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instala as dependências de produção
RUN npm install --only=production

# Copia o resto do código-fonte do backend
COPY . .

# Expõe a porta em que a aplicação vai rodar.
EXPOSE 3000 

# Comando para iniciar o servidor quando o container for executado
CMD [ "node", "server.js" ]