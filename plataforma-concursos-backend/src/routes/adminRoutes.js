import express from "express";
import { autenticar } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Exemplo de rota protegida — só acessa quem tiver token válido
router.get("/dashboard", autenticar, (req, res) => {
  res.json({
    mensagem: `Bem-vindo, ${req.admin.nome}!`,
    email: req.admin.email,
  });
});

export default router;
