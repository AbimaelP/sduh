import express from "express";
import axios from "axios";
import qs from "querystring";
import crypto from "crypto";
import {
  GOVBR_CLIENT_ID,
  GOVBR_CLIENT_SECRET,
  GOVBR_REDIRECT_URI,
  loadGovbrConfig,
  GOVBR_AUTH_URL,
  GOVBR_TOKEN_URL,
  GOVBR_USERINFO_URL,
  APPSHEET_URL,
  APPSHEET_KEY,
  GOVRCODE_VERIFIER,
} from "../config.js";

await loadGovbrConfig();

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
    let accessVerifyFilter = `Filter(users, [email] = "${safeIdentify}")`;

    if (authType === "gov") {
      accessVerifyFilter = `Filter(users, [cpf] = "${safeIdentify}")`;//`Filter(users, [cpf] = "${safeIdentify}")`;
    }
    // 🔹 Buscar usuário
    const response = await axios.post(
      `${APPSHEET_URL}/tables/users/Action`,
      {
        Action: "Find",
        Properties: {
          Locale: "en-US",
          Selector: accessVerifyFilter,
        },
      },
      {
        headers: { ApplicationAccessKey: APPSHEET_KEY },
      }
    );
    return res.json(response.data)
    const user = response.data[0];

    if (authType === "gov" && !user) {
      return res
        .status(401)
        .json({ error: "Usuário não cadastrado no sistema" });
    }

    if (authType === "prototipo" && (!user || user.password !== safePass)) {
      return res.status(401).json({ error: "Usuário ou senha incorretos" });
    }

    user.profiles = [];

    const profileMunicipal = { value: 'municipio_user', label: 'Municipal' };
    const profileCidadao = { value: 'cidadao', label: 'Cidadão' };
    const profilesSDUH = { value: 'sduh_user', label: 'SDUH' };
    const profilesGestaoSDUH = { value: 'sduh_mgr', label: 'SDUH (Gestão Estadual)' };
    // Ajustar role
    if (user.role === "municipio_user" || user.role === "user") {
      user.role = "municipio_user";
      user.main_role = "municipio_user";
      user.profiles.push(profileMunicipal);
      user.profiles.push(profileCidadao);
    }

    if (user.role === 'sduh_user') {
      user.role = "sduh_user";
      user.main_role = "sduh_user"
      user.profiles.push(profileMunicipal);
      user.profiles.push(profileCidadao);
      user.profiles.push(profilesSDUH);
    }

    if (user.role === 'sduh_mgr') {
      user.role = "sduh_mgr";
      user.main_role = "sduh_mgr"
      user.profiles.push(profileMunicipal);
      user.profiles.push(profileCidadao);
      user.profiles.push(profilesSDUH);
      user.profiles.push(profilesGestaoSDUH);
    }

    
    if (user.role === "admin" || user.role === 'adm') {
      user.role = "municipio_user";
      user.main_role = "admin"
      user.profiles.push(profileMunicipal);
      user.profiles.push(profileCidadao);
      user.profiles.push(profilesSDUH);
      user.profiles.push(profilesGestaoSDUH);
    }

    if (user && !user.role) {
      return res.json({})
    }
    // 🔹 Buscar municípios relacionados
    const municipiosUsersRes = await axios.post(
      `${APPSHEET_URL}/tables/municipios_users/Action`,
      {
        Action: "Find",
        Properties: {
          Locale: "en-US",
          Selector: `Filter(municipios_users, [user_id] = "${user.id}")`,
        },
      },
      {
        headers: { ApplicationAccessKey: APPSHEET_KEY },
      }
    );

    const municipioIds = municipiosUsersRes.data.map((item) =>
      parseInt(item.municipio_id)
    );

    const municipiosRes = await axios.post(
      `${APPSHEET_URL}/tables/municipios/Action`,
      {
        Action: "Find",
        Properties: {
          Locale: "en-US",
          Selector: `Filter(municipios, true)`,
        },
      },
      { headers: { ApplicationAccessKey: APPSHEET_KEY } }
    );

    const municipiosCodigoIbge = municipiosRes.data
      .filter((m) => municipioIds.includes(parseInt(m.id)))
      .map((m) => parseInt(m.codibge));

    // 🔹 Buscar app relacionado (tabela users_app → app)
    const usersAppRes = await axios.post(
      `${APPSHEET_URL}/tables/users_app/Action`,
      {
        Action: "Find",
        Properties: {
          Locale: "en-US",
          Selector: `Filter(users_app, [user_id] = "${user.id}")`,
        },
      },
      {
        headers: { ApplicationAccessKey: APPSHEET_KEY },
      }
    );

    let appLink = null;

    if (usersAppRes.data.length > 0) {
      const appId = usersAppRes.data[0].app_id;

      const appRes = await axios.post(
        `${APPSHEET_URL}/tables/app/Action`,
        {
          Action: "Find",
          Properties: {
            Locale: "en-US",
            Selector: `Filter(app, [id] = "${appId}")`,
          },
        },
        {
          headers: { ApplicationAccessKey: APPSHEET_KEY },
        }
      );

      if (appRes.data.length > 0) {
        try {
          const parsed = JSON.parse(appRes.data[0].app_link);
          appLink = parsed.Url; // ou parsed.LinkText
        } catch (e) {
          appLink = appRes.data[0].app_link; // fallback se não for JSON válido
        }
      }
    }
    return res.json({
      id: user.id,
      name: user.name,
      role: user.role,
      main_role: user.main_role,
      municipios: municipiosCodigoIbge,
      app_link: appLink,
      profiles: user.profiles
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
