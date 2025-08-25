import express from 'express';
import axios from 'axios';
import { APPSHEET_URL, APPSHEET_KEY } from '../config.js';

const router = express.Router();

function sanitizeInput(str) {
  return String(str).replace(/["'\\]/g, "");
}

router.post('/', async (req, res) => {
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

export default router;
