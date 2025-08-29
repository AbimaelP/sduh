import express from 'express';
import axios from 'axios';
import { API_URL, CLIENT_ID, CLIENT_SECRET } from '../config.js';

const router = express.Router();

// GET /empreendimentos?statusObra=xxx&token=YYY
router.get('/', async (req, res) => {
  const { statusObra, token, municipios, limit } = req.query;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const response = await axios.get(`${API_URL}/empreendimentos/listaempreendimentos`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let data = response.data.data;

    if (statusObra) {
      data = data.filter(item => item.statusObra === statusObra);
    }

   if (municipios) {
      const municipiosArray = municipios.split(',').map(id => Number(id));
      data = data.filter(item => municipiosArray.includes(item.codigoIbge));
    }

    return res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.error || err.message || 'Erro desconhecido';
    return res.status(status).json({ error: message });
  }
});

// GET /empreendimentos/ultima-atualizacao?token=YYY
router.get('/ultima-atualizacao', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const response = await axios.get(`${API_URL}/empreendimentos/listaempreendimentos?limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let data = response.data.last_updated;
    return res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.error || err.message || 'Erro desconhecido';
    return res.status(status).json({ error: message });
  }
});

// GET /empreendimentos/token
router.get('/token', async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/auth/token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    });

    const data = response.data.access_token;
    return res.json(data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    const status = err.response?.status || 500;
    const message = err.response?.data?.error || err.message || 'Erro desconhecido';
    return res.status(status).json({ error: message });
  }
});

export default router;
