import express from "express";
import axios from "axios";
import qs from "querystring";
import crypto from "crypto";
import { User } from "../models/User.js";
import { Role } from "../models/Role.js";
import {
  GOVBR_CLIENT_ID,
  GOVBR_CLIENT_SECRET,
  GOVBR_REDIRECT_URI,
  loadGovbrConfig,
  loadMinhaAreaConfig,
  GOVBR_AUTH_URL,
  GOVBR_TOKEN_URL,
  GOVBR_USERINFO_URL,
  APPSHEET_URL,
  APPSHEET_KEY,
  GOVRCODE_VERIFIER,
  MINHAAREA_CLIENT_ID,
  MINHAAREA_SECRET,
  CYBERARK_TOKEN_URL,
  CYBERARK_USERINFO_URL,
  CYBERARK_AUTH_URL,
  REDIRECT_URL_MINHAAREA,
  REDIRECT_URI,
} from "../config.js";

await loadGovbrConfig();
await loadMinhaAreaConfig();

const router = express.Router();

function sanitizeInput(str) {
  return String(str).replace(/["'\\]/g, "");
}
router.post("/login", async (req, res) => {
  const { identify, password, authType } = req.body;

  if (!identify || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  const safeIdentify = sanitizeInput(identify);
  const safePass = sanitizeInput(password);

  try {
    let whereClause = {};

    if (authType === "gov") {
      whereClause.cpf = safeIdentify;
    } else {
      whereClause.email = safeIdentify;
    }

    const user = await User.findOne({
      where: whereClause,
      include: [
        {
          model: Role,
          through: { attributes: [] }, // oculta os campos da tabela pivot
        },
      ],
    });

    if (authType === "gov" && !user) {
      return res
        .status(401)
        .json({ error: "Usuário não cadastrado no sistema" });
    }

    if (authType === "prototipo" && (!user || user.password !== safePass)) {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    user.role = user.Roles[0].name;
    user.profiles = [];

    const profileMunicipal = {
      value: "municipio_user",
      label: "Municipal",
      appLink:
        "https://www.appsheet.com/start/74847a1c-56fa-4087-bb14-d3cb48aaef4f",
      looker:
        "https://lookerstudio.google.com/embed/reporting/41164f8d-3a25-4e8c-97c7-ac349b9e3dfe/page/r4NVF",
    };
    const profileCidadao = {
      value: "cidadao",
      label: "Cidadão",
      appLink: "",
      looker: "",
    };
    const profilesSDUH = {
      value: "sduh_user",
      label: "SDUH",
      appLink:
        "https://www.appsheet.com/start/448169c0-b347-4ecf-ae5e-896b7e381176",
      looker: "",
    };
    const profilesGestaoSDUH = {
      value: "sduh_mgr",
      label: "SDUH (Gestão Estadual)",
      appLink:
        "https://www.appsheet.com/start/448169c0-b347-4ecf-ae5e-896b7e381176",
      looker:
        "https://lookerstudio.google.com/embed/reporting/5756095b-0b28-42b9-a27e-09de5e988aef/page/r4NVF",
    };
    // Ajustar role
    if (user.role === "municipio_user" || user.role === "user") {
      user.role = "municipio_user";
      user.main_role = "municipio_user";
      user.profiles.push(profileMunicipal);
      // user.profiles.push(profileCidadao);
      user.appLink =
        "https://www.appsheet.com/start/74847a1c-56fa-4087-bb14-d3cb48aaef4f";
      user.looker =
        "https://lookerstudio.google.com/embed/reporting/41164f8d-3a25-4e8c-97c7-ac349b9e3dfe/page/r4NVF";
    }

    if (user.role === "sduh_user") {
      user.role = "sduh_user";
      user.main_role = "sduh_user";
      user.profiles.push(profileMunicipal);
      // user.profiles.push(profileCidadao);
      user.profiles.push(profilesSDUH);
      user.appLink =
        "https://www.appsheet.com/start/448169c0-b347-4ecf-ae5e-896b7e381176";
      user.looker = "";
    }

    if (user.role === "sduh_mgr") {
      user.role = "sduh_mgr";
      user.main_role = "sduh_mgr";
      user.profiles.push(profileMunicipal);
      // user.profiles.push(profileCidadao);
      user.profiles.push(profilesSDUH);
      user.profiles.push(profilesGestaoSDUH);
      user.appLink =
        "https://www.appsheet.com/start/448169c0-b347-4ecf-ae5e-896b7e381176";
      user.looker = "";
    }

    if (user.role === "admin" || user.role === "adm") {
      user.role = "municipio_user";
      user.main_role = "admin";
      user.profiles.push(profileMunicipal);
      // user.profiles.push(profileCidadao);
      user.profiles.push(profilesSDUH);
      user.profiles.push(profilesGestaoSDUH);
      user.appLink =
        "https://www.appsheet.com/start/74847a1c-56fa-4087-bb14-d3cb48aaef4f";
      user.looker =
        "https://lookerstudio.google.com/embed/reporting/41164f8d-3a25-4e8c-97c7-ac349b9e3dfe/page/r4NVF";
    }

    if (user && !user.role) {
      return res
        .status(400)
        .json({ error: "Usuário não possui nível de acesso definido" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      role: user.role,
      looker: user.looker,
      main_role: user.main_role,
      profiles: user.profiles,
      appLink: user.appLink,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

function base64URLEncode(str) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

router.get("/minha-area/callback", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");

  const url =
    `${CYBERARK_AUTH_URL()}?client_id=${MINHAAREA_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URL_MINHAAREA)}` +
    `&response_type=code` +
    `&scope=openid+email+profile` +
    `&state=${state}`

  res.json({ url });
});

router.post("/cyberark/callback", async (req, res) => {
  const { code } = req.body;
  if (!code)
    return res
      .status(400)
      .json({ error: "Código de autorização não recebido" });

  try {

    const tokenResponse = await axios.post(
      CYBERARK_TOKEN_URL(),
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URL_MINHAAREA,
        client_id: MINHAAREA_CLIENT_ID,
        client_secret: MINHAAREA_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { access_token } = tokenResponse.data;

    const userInfoResponse = await axios.get(CYBERARK_USERINFO_URL(), {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return res.json({ user: userInfoResponse.data });
  } catch (err) {
    // Extrair apenas info relevante para o frontend
    const status = err.response?.status || 500;
    const message = err.response?.data || err.message;
    console.error(message); // log completo no backend
    return res.status(status).json({ error: message });
  }
});

router.get("/gov/login", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  const nonce = crypto.randomBytes(16).toString("hex");

  // Hardcoded code_verifier
  const code_verifier = GOVRCODE_VERIFIER;

  const code_challenge = base64URLEncode(sha256(code_verifier));
  const code_challenge_method = "S256";

  // Salvar na sessão se quiser manter compatibilidade
  req.session.code_verifier = code_verifier;
  req.session.state = state;
  req.session.nonce = nonce;

  const url =
    `${GOVBR_AUTH_URL()}?response_type=code` +
    `&client_id=${GOVBR_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(GOVBR_REDIRECT_URI)}` +
    `&scope=openid+email+profile` +
    `&state=${state}` +
    `&nonce=${nonce}` +
    `&code_challenge=${code_challenge}` +
    `&code_challenge_method=${code_challenge_method}`;

  res.json({ url });
});

router.post("/gov/callback", async (req, res) => {
  const { code } = req.body;
  if (!code)
    return res
      .status(400)
      .json({ error: "Código de autorização não recebido" });

  try {
    const authString = `${GOVBR_CLIENT_ID}:${GOVBR_CLIENT_SECRET}`;
    const authBase64 = Buffer.from(authString).toString("base64");

    const tokenResponse = await axios.post(
      GOVBR_TOKEN_URL(),
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: GOVBR_REDIRECT_URI,
        code_verifier: GOVRCODE_VERIFIER,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authBase64}`,
        },
      }
    );
    const { access_token } = tokenResponse.data;

    const userInfoResponse = await axios.get(GOVBR_USERINFO_URL(), {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    return res.json({ user: userInfoResponse.data });
  } catch (err) {
    // Extrair apenas info relevante para o frontend
    const status = err.response?.status || 500;
    const message = err.response?.data || err.message;
    console.error(message); // log completo no backend
    return res.status(status).json({ error: message });
  }
});

export default router;
