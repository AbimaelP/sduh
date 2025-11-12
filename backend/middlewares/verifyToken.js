import { decodeJwt } from "jose";
import {
  verifyGovbrToken,
  verifyGovbrTokenSignature,
} from "../utils/tokens.js";
import { GOVBR_CLIENT_ID } from "../config.js";

export const requireGovbrTokenAndCpf = async (req, res, next) => {
  try {
    if (process.env.AMBIENTE == "dev" && process.env.MOCK_TEST == "on") {
      req.user = {
        cpf: process.env.MOCK_CPF_TEST,
        token_id: process.env.MOCK_TOKEN_TEST,
      };
      return next();
    }

    const authHeader = req.headers.authorization;
    const { cpf } = req.body;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ status: 401, detail: "Token não fornecido" });
    }

    if (!cpf) {
      return res.status(400).json({ status: 400, detail: "CPF não informado" });
    }

    const id_token = authHeader.split(" ")[1];
    const payload = await verifyGovbrTokenSignature(id_token);

    if (payload.sub !== cpf) {
      return res
        .status(401)
        .json({ status: 401, detail: "CPF inválido para esse token" });
    }

    req.user = payload;
    return next(); // ✅ garante saída correta
  } catch (err) {
    return res
      .status(401)
      .json({ error: err.message, code: "INVALID_GOVBR_TOKEN" });
  }
};

export const validateTokenAndGetPayload = async (authHeader, res) => {
  if (process.env.AMBIENTE == "dev" && process.env.MOCK_TEST == "on") {
    return {
      cpf: process.env.MOCK_CPF_TEST,
      token_id: process.env.MOCK_TOKEN_TEST,
    };
  }
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token expirado ou inválido");
  }

  const token_id = authHeader.split(" ")[1];
  const payload = await verifyGovbrTokenSignature(token_id);
  const cpf = payload.sub;

  return { cpf, token_id };
};

export const validateTokenAndGetPayloadWithStatus = async (authHeader, res) => {
  if (process.env.AMBIENTE == "dev" && process.env.MOCK_TEST == "on") {
    return {
      cpf: process.env.MOCK_CPF_TEST,
      token_id: process.env.MOCK_TOKEN_TEST,
    };
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Token expirado ou inválido");
    error.status = 401; // adiciona status HTTP
    throw error;
  }

  const token_id = authHeader.split(" ")[1];
  const payload = await verifyGovbrTokenSignature(token_id);
  const cpf = payload.sub;
  return { cpf, token_id };
};
