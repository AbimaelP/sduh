import { webcrypto } from "crypto";
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

import https from "https";
import redis from "../redisClient.js";
import axios from "axios";
import { GOVBR_JWK_URL, GOVAPI_URL, GOVBR_CLIENT_ID, CLIENT_ID, CLIENT_SECRET, API_URL } from "../config.js";
import * as jose from "jose";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";

export const sduhToken = async () => {
  try {
    const redisKey = "sduh:token";

    // 1️⃣ Verifica se já existe token válido no Redis
    const cachedToken = await redis.get(redisKey);
    if (cachedToken) {
      console.log("🔁 Usando token do Redis");
      return cachedToken;
    }

    const response = await axios.post(`${API_URL}/auth/token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    });

    const token = response.data.access_token;
    const validity = response.data.expires_in || 3600; // segundos

    await redis.setEx(redisKey, validity, token);
    console.log(`✅ Novo token salvo no Redis (expira em ${validity}s)`);

    return token;
  } catch (error) {
    throw new Error( error.response?.data?.error_description || "Falha ao obter token do DataPrev"
    );
  }
};

export const verifyGovbrToken = async (id_token) => {
  try {
    const { data } = await axios.get(GOVBR_JWK_URL);
    const jwks = jose.createLocalJWKSet(data);

    // Verifica assinatura e validade do token
    const { payload } = await jose.jwtVerify(id_token, jwks, {
      algorithms: ["RS256"],
      issuer: GOVAPI_URL,
      audience: GOVBR_CLIENT_ID,
    });

    return payload;
  } catch (err) {
    console.error("Falha ao validar ID_TOKEN:", err);

    // Lança um erro com código interno
    const error = new Error("ID_TOKEN inválido ou expirado");
    error.code = "INVALID_GOVBR_TOKEN"; // código único para frontend
    throw error;
  }
};

export const verifyGovbrTokenSignature = async (id_token) => {
  try {
    const { data } = await axios.get(GOVBR_JWK_URL);
    const jwks = data.keys;

    const decodedHeader = jwt.decode(id_token, { complete: true });
    if (!decodedHeader) throw new Error("Token malformado");
    const kid = decodedHeader.header.kid;

    const jwk = jwks.find((key) => key.kid === kid);
    if (!jwk) throw new Error("Chave pública não encontrada para este token");

    const publicKey = jwkToPem(jwk);

    const payload = jwt.verify(id_token, publicKey, {
      algorithms: ["RS256"],
      ignoreExpiration: true, // ✅ Ignora expiração
    });

    return payload; // token decodificado, assinatura válida
  } catch (err) {
    const error = new Error("ID_TOKEN inválido ou malformado");
    error.code = "INVALID_GOVBR_TOKEN";
    throw error;
  }
};
