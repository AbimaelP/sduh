import express from 'express';
import cors from 'cors';
import session from 'express-session'; // 👈 importar
import login from './routes/login.js';
import empreendimentos from './routes/empreendimentos.js';
import { PORT } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());

// 👇 configurar sessões
app.use(session({
  secret: process.env.SESSION_SECRET, // troque por variável de ambiente
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // true se usar HTTPS
}));

app.use('/auth', login);
app.use('/empreendimentos', empreendimentos);

(async () => {
  try {
    await loadGovbrConfig(); // 👈 carrega endpoints antes de iniciar
    app.listen(PORT, () => {
      console.log(`Backend rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao inicializar GovBR config:", err.message);
    process.exit(1);
  }
})();