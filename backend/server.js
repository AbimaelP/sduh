import express from 'express';
import cors from 'cors';
import session from 'express-session';
import login from './routes/login.js';
import empreendimentos from './routes/empreendimentos.js';
import { loadGovbrConfig, PORT } from './config.js';

const app = express();

// Se estiver atrás de proxy reverso (HTTPS), necessário para cookies secure
app.set('trust proxy', 1);

// CORS configurado para permitir cookies
app.use(cors({
  origin: 'https://homologacao.horushab.habitacao.sp.gov.br', // substitua pelo domínio do frontend
  credentials: true
}));

// Parse JSON
app.use(express.json());

// Configuração de sessões
app.use(session({
  secret: process.env.SESSION_SECRET, // variável de ambiente obrigatória
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,     // true porque HTTPS
    httpOnly: true,   // não acessível via JS do browser
    sameSite: 'lax'   // protege contra CSRF, mas permite redirect OAuth
  }
}));

// Rotas
app.use('/auth', login);
app.use('/empreendimentos', empreendimentos);

// Inicializa config Gov.br antes de subir o servidor
(async () => {
  try {
    await loadGovbrConfig(); 
    app.listen(PORT, () => {
      console.log(`Backend rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error("Erro ao inicializar GovBR config:", err.message);
    process.exit(1);
  }
})();
