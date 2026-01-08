# ----------------------------------------------------
# Dockerfile para o Backend (Node.js API)
# ATENÇÃO: Contém segredos. Não use em produção.
# ----------------------------------------------------

# Estágio 1: Usar uma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Define as variáveis de ambiente para a aplicação

ENV APP_SHEET_URL="https://api.appsheet.com/api/v2/apps/44299b5a-b51e-417d-96aa-393fba931ab1"
ENV APP_SHEET_KEY="V2-rwLB4-JTgfh-OJY0w-Ojbke-PXYph-zxcUW-IIQg4-UDdEX"
ENV API_URL="https://horushab.habitacao.sp.gov.br/public"
ENV CLIENT_ID="horushab"
ENV SECRET="dnYFc6f2txBs3Ug2LK62GqDQyZr9dBuq6AbmLug5Z2wQN5iuvVH4nVCVXRbARGCa"

ENV GOVAPI_URL=https://sso.acesso.gov.br/
ENV REDIRECT_URL=https://horushab.habitacao.sp.gov.br
ENV GOV_REDIRECT_URL="https://horushab.habitacao.sp.gov.br/callback"
ENV GOV_OPENID_CONFIGURATION="https://idp.sp.gov.br/auth/realms/idpsp/.well-known/openid-configuration"
ENV GOV_CLIENT_ID="sduh.horus-hab"
ENV GOV_CLIENT_SECRET="1e0fb1a8-ae7f-4795-9406-8ff536b1e4bc"
ENV SESSION_SECRET="1e0fb1a8-ae7f-4795-9406-8ff536b1e4bc"
ENV CODE_VERIFIER="uudliovupEodE4c7TPIYl0pXsEfGE_d0ki_09XdI9kg"
ENV GOVBR_JWK_URL="https://sso.acesso.gov.br/jwk"

ENV PORT=3000
ENV DB_NAME="appsheet"
ENV DB_USER="be_postgres"
ENV DB_PASSWORD="7C793>)-U3Y^p_sg"
ENV DB_HOST="/cloudsql/sduh-prod:southamerica-east1:geoserver"
ENV DB_PORT="5432"

ENV APP_ID=horus_prod
ENV OIDC_AUTH=https://abc4966.id.cyberark.cloud
ENV OPENID_CONFIGURATION=https://abc4966.id.cyberark.cloud/horus_prod/.well-known/openid-configuration
ENV CLIENT_ID_AUTH=d8e52d41-8bed-4127-ab2e-d18391f4c64c
ENV SECRET_AUTH=OlJlY29yZEluZGV4OjA6QXBwVHlwZTpXZWI6
ENV APP_KEY=b0a356de-ad20-46a4-b33b-9fcac7b839c6
ENV REDIRECT_URL_MINHAAREA=https://horushab.habitacao.sp.gov.br/cyberark/callback
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