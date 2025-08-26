import express from 'express';
import axios from 'axios';
import { API_URL } from '../config.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { statusObra } = req.query;

  try {
    const response = await axios.get(`${API_URL}/empreendimentos/listaempreendimentos`, {
      headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJob3J1c2hhYiIsImFjY2Vzc190eXBlIjoicmVhZGVyIiwiZXhwIjoxNzU2MTg0MDYyfQ.t0KLMG-2INpbHyiaSKVi7l6GOcqH4z0ZepNZOqmBzEo' }
    });
    let data = response.data.data
    if (statusObra) {
      data = data.filter((item) => { return item.statusObra === statusObra})
    }

     
    return res.json(data);

  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: err.response.status });
  }
});

export default router;
