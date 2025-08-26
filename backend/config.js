import dotenv from 'dotenv';
dotenv.config();

export const APPSHEET_URL = process.env.APP_SHEET_URL;
export const APPSHEET_KEY = process.env.APP_SHEET_KEY;
export const API_URL = process.env.API_URL;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = 
export const PORT = process.env.PORT || 3000;
export const GOVBR_CLIENT_ID = "SEU_CLIENT_ID";
export const GOVBR_CLIENT_SECRET = "SEU_CLIENT_SECRET";
export const GOVBR_REDIRECT_URI = process.env.REDIRECT_URL_GOV
export const GOVBR_AUTH_URL = "https://sso.staging.acesso.gov.br/authorize";
export const GOVBR_TOKEN_URL = "https://sso.staging.acesso.gov.br/token";
export const GOVBR_USERINFO_URL = "https://sso.staging.acesso.gov.br/userinfo";
