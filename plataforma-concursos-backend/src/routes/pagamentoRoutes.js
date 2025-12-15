// src/routes/pagamentoRoutes.js
// Rotas oficiais do fluxo de pagamento via Mercado Pago

import express from "express";

// 🔐 Middleware CORRETO → apenas candidatos podem gerar pagamento
import authCandidato from "../middlewares/authCandidato.js";

import {
  gerarPagamento,
  receberWebhook,
  retornoSucesso,
  retornoFalha,
  retornoPendente,
} from "../controllers/pagamentoController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| 💳 POST /api/pagamentos/gerar
|--------------------------------------------------------------------------
| Gera uma preferência de pagamento no Mercado Pago.
| Retorna:
|   → paymentId
|   → init_point (link para pagar)
|
| 🔒 Proteção:
|   Apenas candidatos autenticados podem gerar pagamento.
|--------------------------------------------------------------------------
*/
router.post("/gerar", authCandidato, gerarPagamento);

/*
|--------------------------------------------------------------------------
| 📩 POST /api/pagamentos/webhook
|--------------------------------------------------------------------------
| Webhook OFICIAL do Mercado Pago.
| - SEM autenticação (importante!)
| - O Mercado Pago envia aqui:
|       pagamento aprovado / pendente / recusado
|
| Essa rota deve sempre responder 200 OK.
|--------------------------------------------------------------------------
*/
router.post("/webhook", receberWebhook);

/*
|--------------------------------------------------------------------------
| 🔁 Rotas de retorno (redirect do MP)
|--------------------------------------------------------------------------
| GET /sucesso
| GET /falha
| GET /pendente
|
| O Mercado Pago envia o usuário de volta ao sistema após o pagamento.
| O frontend mostra a tela correspondente.
|--------------------------------------------------------------------------
*/
router.get("/sucesso", retornoSucesso);
router.get("/falha", retornoFalha);
router.get("/pendente", retornoPendente);

export default router;
