import express from 'express';
import cors from 'cors';
import login from './routes/login.js';
import empreendimentos from './routes/empreendimentos.js';
import { PORT } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/login', login);
app.use('/empreendimentos', empreendimentos);

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
});
