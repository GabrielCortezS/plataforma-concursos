// -----------------------------------------------------------------------------
// Importa os módulos principais do Node
// -----------------------------------------------------------------------------
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// -----------------------------------------------------------------------------
// Importação das rotas
// -----------------------------------------------------------------------------
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import concursoRoutes from "./src/routes/concursoRoutes.js";
import cargoRoutes from "./src/routes/cargoRoutes.js";
import inscricaoRoutes from "./src/routes/inscricaoRoutes.js";
import candidatoAuthRoutes from "./src/routes/candidatoAuthRoutes.js";
import candidatoRoutes from "./src/routes/candidatoRoutes.js";
import contatoRoutes from "./src/routes/contatoRoutes.js";
import pagamentoRoutes from "./src/routes/pagamentoRoutes.js";

// -----------------------------------------------------------------------------
// Configuração das variáveis de ambiente (.env)
// -----------------------------------------------------------------------------
dotenv.config();

// -----------------------------------------------------------------------------
// Criação da aplicação Express
// -----------------------------------------------------------------------------
const app = express();

/*
|--------------------------------------------------------------------------
| 🔥 Middleware JSON com RAW BODY (Mercado Pago)
|--------------------------------------------------------------------------
| Necessário para validação da assinatura dos webhooks do Mercado Pago
| IMPORTANTE: deve vir ANTES das rotas
*/
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

/*
|--------------------------------------------------------------------------
| 🌐 Liberação de CORS
|--------------------------------------------------------------------------
*/
app.use(cors());

/*
|--------------------------------------------------------------------------
| 📂 Configuração correta de __dirname (ES Modules)
|--------------------------------------------------------------------------
| Necessário pois o projeto utiliza "type": "module"
*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
|--------------------------------------------------------------------------
| 📁 Arquivos estáticos (UPLOADS)
|--------------------------------------------------------------------------
| Permite acesso direto a arquivos via navegador
| Exemplo:
| http://localhost:5000/uploads/comprovantes/arquivo.pdf
|
| Estrutura real do projeto:
| backend/uploads/comprovantes
| backend/uploads/candidatos
| backend/uploads/documentos
*/
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "uploads"))
);

/*
|--------------------------------------------------------------------------
| 🧭 Rotas da API
|--------------------------------------------------------------------------
*/
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/concursos", concursoRoutes);
app.use("/api/cargos", cargoRoutes);
app.use("/api/inscricoes", inscricaoRoutes);
app.use("/api/candidato", candidatoAuthRoutes);
app.use("/api/candidato", candidatoRoutes);
app.use("/api/contato", contatoRoutes);
app.use("/api/pagamentos", pagamentoRoutes);

/*
|--------------------------------------------------------------------------
| 🚀 Rota base (Health Check)
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  res.send("API da Plataforma de Concursos está rodando 🚀");
});

/*
|--------------------------------------------------------------------------
| 🗄 Conexão com MongoDB
|--------------------------------------------------------------------------
*/
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) =>
    console.error("❌ Erro ao conectar ao MongoDB:", err)
  );

/*
|--------------------------------------------------------------------------
| 🔌 Inicialização do servidor
|--------------------------------------------------------------------------
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
