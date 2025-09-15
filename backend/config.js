import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

export const APPSHEET_URL = process.env.APP_SHEET_URL;
export const APPSHEET_KEY = process.env.APP_SHEET_KEY;
export const API_URL = process.env.API_URL;
export const CLIENT_ID = process.env.CLIENT_ID;
export const CLIENT_SECRET = process.env.CLIENT_SECRET;
export const PORT = process.env.PORT || 3000;

export const GOVBR_CLIENT_ID = process.env.GOV_CLIENT_ID;
export const GOVBR_CLIENT_SECRET = process.env.GOV_CLIENT_SECRET;
export const GOVBR_REDIRECT_URI = process.env.REDIRECT_URL_GOV;
export const GOVRCODE_VERIFIER = process.env.CODE_VERIFIER;

export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASSWORD;

// Discovery endpoint do Gov.br homologação
const DISCOVERY_URL = process.env.GOV_OPENID_CONFIGURATION;

let _GOVBR_AUTH_URL;
let _GOVBR_TOKEN_URL;
let _GOVBR_USERINFO_URL;

export async function loadGovbrConfig() {
  try {
    const { data } = await axios.get(DISCOVERY_URL);
    _GOVBR_AUTH_URL = data.authorization_endpoint;
    _GOVBR_TOKEN_URL = data.token_endpoint;
    _GOVBR_USERINFO_URL = data.userinfo_endpoint;
  } catch (err) {
    console.error("Erro ao carregar configuração Gov.br:", err.message);
    throw err;
  }
}

export function GOVBR_AUTH_URL() {
  return _GOVBR_AUTH_URL;
}

export function GOVBR_TOKEN_URL() {
  return _GOVBR_TOKEN_URL;
}

export function GOVBR_USERINFO_URL() {
  return _GOVBR_USERINFO_URL;
}