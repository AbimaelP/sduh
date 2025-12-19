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

export const MINHAAREA_CLIENT_ID = process.env.CLIENT_ID_AUTH;
export const MINHAAREA_SECRET = process.env.SECRET_AUTH;
export const MINHAAREA_DISCOVERY_URL = process.env.OPENID_CONFIGURATION;
export const MINHAAREA_APP_ID = process.env.APP_ID;
export const MINHAAREA_APP_KEY = process.env.APP_KEY;
export const MINHAAREA_OICD_URL = process.env.OIDC_AUTH;
export const REDIRECT_URL_MINHAAREA = process.env.REDIRECT_URL_MINHAAREA;

export const DB_HOST = process.env.DB_HOST;
export const DB_NAME = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASSWORD;

export const REDIS_HOST = process.env.REDIS_HOST;
export const OIDC_AUTH = process.env.OIDC_AUTH;
export const GOVBR_JWK_URL = process.env.GOVBR_JWK_URL;
// Discovery endpoint do Gov.br homologação.
const DISCOVERY_URL = process.env.OPENID_CONFIGURATION;

let _AUTH_URL;
let _TOKEN_URL;
let _USERINFO_URL;

<<<<<<< HEAD
export async function loadAuthConfig() {
=======
let _CYBERARK_AUTH_URL;
let _CYBERARK_TOKEN_URL;
let _CYBERARK_USERINFO_URL;

export async function loadGovbrConfig() {
>>>>>>> 33f907a0be75e617fcf8f13faf2592d7c0ab6b1c
  try {
    const { data } = await axios.get(DISCOVERY_URL);
    _AUTH_URL = data.authorization_endpoint;
    _TOKEN_URL = data.token_endpoint;
    _USERINFO_URL = data.userinfo_endpoint;
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

export function AUTH_URL() {
  return _AUTH_URL;
}

export function TOKEN_URL() {
  return _TOKEN_URL;
}

<<<<<<< HEAD
export function USERINFO_URL() {
  return _USERINFO_URL;
}
=======
export function GOVBR_USERINFO_URL() {
  return _GOVBR_USERINFO_URL;
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
>>>>>>> 33f907a0be75e617fcf8f13faf2592d7c0ab6b1c
