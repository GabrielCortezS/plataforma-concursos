// Importa os módulos principais do Node
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import concursoRoutes  from "./src/routes/concursoRoutes.js";
import cargoRoutes from "./src/routes/cargoRoutes.js";
import inscricaoRoutes from "./src/routes/inscricaoRoutes.js";
import candidatoAuthRoutes from "./src/routes/candidatoAuthRoutes.js";
import candidatoRoutes from "./src/routes/candidatoRoutes.js";
import contatoRoutes from "./src/routes/contatoRoutes.js";

// Configura o uso das variáveis de ambiente
dotenv.config();

// Cria uma instância do Express
const app = express();

// Middleware para permitir requisições JSON e acesso externo (CORS)
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/concursos", concursoRoutes);
app.use("/api/cargos", cargoRoutes);
app.use("/api/inscricoes", inscricaoRoutes);
app.use("/api/candidato", candidatoAuthRoutes);
app.use("/comprovantes", express.static("comprovantes"));
app.use("/api/candidato", candidatoRoutes);
app.use("/api/contato", contatoRoutes);

// Permitir acesso à pasta uploads
app.use("/uploads", express.static("uploads"));


// Porta vinda do arquivo .env ou padrão 5000
const PORT = process.env.PORT || 5000;

// Conexão com o banco de dados MongoDB (será configurado em breve)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// Rota simples inicial (teste do servidor)
app.get("/", (req, res) => {
  res.send("API da Plataforma de Concursos está rodando 🚀");
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
