// src/routes/pagamentoRoutes.js
// Rotas relacionadas ao pagamento da inscrição (Mercado Pago)

import express from "express";
import { gerarPagamento } from "../controllers/pagamentoController.js";
import { autenticar } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
|------------------------------------------------------------------
| POST /api/pagamentos/gerar
|------------------------------------------------------------------
| Gera a preferência de pagamento no Mercado Pago.
| 🔒 Rota protegida → apenas candidato logado pode pagar.
*/
router.post("/gerar", autenticar, gerarPagamento);

export default router;
