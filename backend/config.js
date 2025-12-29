import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const APPSHEET_URL = process.env.APP_SHEET_URL;
export const APPSHEET_KEY = process.env.APP_SHEET_KEY;
export const API_URL = process.env.API_URL;
export const PORT = process.env.PORT || 3000;

export const CLIENT_ID = process.env.CLIENT_ID;
export const SECRET = process.env.SECRET;

export const CLIENT_ID_AUTH = process.env.CLIENT_ID_AUTH;
export const SECRET_AUTH = process.env.SECRET_AUTH;
export const REDIRECT_URI = process.env.REDIRECT_URL;
export const APP_KEY = process.env.APP_KEY;
export const APP_ID = process.env.APP_ID;

export const GOVRCODE_VERIFIER = process.env.CODE_VERIFIER;
export const GOVAPI_URL = process.env.GOVAPI_URL;
export const GOVBR_CLIENT_ID = process.env.GOV_CLIENT_ID;
export const GOVBR_CLIENT_SECRET = process.env.GOV_CLIENT_SECRET;

export const MINHAAREA_CLIENT_ID = process.env.CLIENT_ID_AUTH;
export const MINHAAREA_SECRET = process.env.SECRET_AUTH;
export const MINHAAREA_DISCOVERY_URL = process.env.OPENID_CONFIGURATION;
export const MINHAAREA_APP_ID = process.env.APP_ID;
export const MINHAAREA_APP_KEY = process.env.APP_KEY;
export const MINHAAREA_OICD_URL = process.env.OIDC_AUTH;
export const REDIRECT_URL_MINHAAREA = process.env.REDIRECT_URL_MINHAAREA;
export const GOVBR_REDIRECT_URI = process.env.GOV_REDIRECT_URL;

export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASSWORD;

export const REDIS_HOST = process.env.REDIS_HOST;
export const OIDC_AUTH = process.env.OIDC_AUTH;
export const GOVBR_JWK_URL = process.env.GOVBR_JWK_URL;
// Discovery endpoint do Gov.br homologação.
const DISCOVERY_URL = process.env.GOV_OPENID_CONFIGURATION;

let _GOV_AUTH_URL;
let _GOV_TOKEN_URL;
let _GOV_USERINFO_URL;

let _CYBERARK_AUTH_URL;
let _CYBERARK_TOKEN_URL;
let _CYBERARK_USERINFO_URL;
//
export async function loadGovbrConfig() {
  try {
    const { data } = await axios.get(DISCOVERY_URL);
    _GOV_AUTH_URL = data.authorization_endpoint;
    _GOV_TOKEN_URL = data.token_endpoint;
    _GOV_USERINFO_URL = data.userinfo_endpoint;
  } catch (err) {
    console.error("Erro ao carregar configuração Gov.br:", err.message);
    throw err;
  }
}
export async function loadMinhaAreaConfig() {
  try {
    const { data } = await axios.get(MINHAAREA_DISCOVERY_URL);
    _CYBERARK_AUTH_URL = data.authorization_endpoint;
    _CYBERARK_TOKEN_URL = data.token_endpoint;
    _CYBERARK_USERINFO_URL = data.userinfo_endpoint;
  } catch (err) {
    console.error("Erro ao carregar configuração Gov.br:", err.message);
    throw err;
  }
}

export function GOVBR_AUTH_URL() {
  return _GOV_AUTH_URL;
}

export function GOVBR_TOKEN_URL() {
  return _GOV_TOKEN_URL;
}

export function GOVBR_USERINFO_URL() {
  return _GOV_USERINFO_URL;
}

export function CYBERARK_AUTH_URL() {
  return _CYBERARK_AUTH_URL;
}

export function CYBERARK_TOKEN_URL() {
  return _CYBERARK_TOKEN_URL;
}

export function CYBERARK_USERINFO_URL() {
  return _CYBERARK_USERINFO_URL;
}
