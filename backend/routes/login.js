import express from 'express';
import axios from 'axios';
import { APPSHEET_URL, APPSHEET_KEY, GOVBR_CLIENT_ID, GOVBR_REDIRECT_URI, GOVBR_AUTH_URL, GOVBR_CLIENT_SECRET, GOVBR_USERINFO_URL } from '../config.js';

const router = express.Router();

function sanitizeInput(str) {
  return String(str).replace(/["'\\]/g, "");
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const safeEmail = sanitizeInput(email);
  const safePass = sanitizeInput(password);

  try {
    const response = await axios.post(
      `${APPSHEET_URL}/tables/users/Action`,
      {
        Action: "Find",
        Properties: {
          Locale: "en-US",
          Selector: `Filter(users, [email] = "${safeEmail}")`
        }
      },
      {
        headers: { 'ApplicationAccessKey': APPSHEET_KEY }
      }
    );

    const user = response.data[0];

    if (!user || user.password !== safePass) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos' });
    }

    return res.json({ id: user.id, name: user.name, role: user.role });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

router.post('/gov', async (req, res) => {
  const url = `${GOVBR_AUTH_URL}?response_type=code&client_id=${GOVBR_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOVBR_REDIRECT_URI)}&scope=openid+email+profile`;
  res.redirect(url);
});

router.get('/gov/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "Código de autorização não recebido" });

  try {
    // Troca o "code" pelo token
    const tokenResponse = await axios.post(
      GOVBR_TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: GOVBR_REDIRECT_URI,
        client_id: GOVBR_CLIENT_ID,
        client_secret: GOVBR_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenResponse.data;

    // Pega os dados do usuário
    const userInfoResponse = await axios.get(GOVBR_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = userInfoResponse.data;

    // Aqui você poderia salvar ou validar o usuário no AppSheet também
    return res.json({ govUser: user });

  } catch (err) {
    console.error("Erro GovBR:", err.response?.data || err.message);
    return res.status(500).json({ error: "Falha na autenticação Gov.br" });
  }
});

export default router;
