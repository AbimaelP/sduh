import express from 'express';
import cors from 'cors';
import session from 'express-session'; // 👈 importar
import login from './routes/login.js';
import empreendimentos from './routes/empreendimentos.js';
import orcamentos from './routes/atendimentosEorcamentos.js';
import { loadGovbrConfig, PORT } from './config.js';
import { testConnection } from './db.js';
import "./models/User.js";
import "./models/Role.js";
import "./models/UserRole.js";
import "./models/associations.js";

const app = express();
app.use(cors());
app.use(express.json());

// 👇 configurar sessões
app.use(session({
  secret: process.env.SESSION_SECRET, // troque por variável de ambiente
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true } // true se usar HTTPS
}));

app.use('/auth', login);
app.use('/empreendimentos', empreendimentos);
app.use('/orcamentos', orcamentos);

(async () => {
  try {
    await loadGovbrConfig();
    await testConnection(); // ⬅️ testa a conexão com o banco
    app.listen(PORT, () => {
      console.log(`Backend rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao inicializar:", err.message);
    process.exit(1);
  }
})();
