// src/controllers/pagamentoController.js
// Controlador responsável pelo fluxo de pagamentos do sistema
// 🔁 PLANO B: Pagamento SIMULADO (sem chamar Mercado Pago)

// import { criarPreferenciaPagamento } from "../services/mercadoPago.js"; // 🔒 Guardado para o futuro
import Inscricao from "../models/Inscricao.js";

/*
|--------------------------------------------------------------------------
| 🟦 1) GERAR PAGAMENTO (PLANO B - SIMULADO)
|--------------------------------------------------------------------------
| POST /api/pagamentos/gerar
|
| O que acontece aqui:
|  - Recebe o ID da inscrição
|  - Verifica se existe e se ainda não está paga
|  - Gera um "paymentId" fake (SIMULADO-...)
|  - Marca a inscrição como PAGA imediatamente
|
| 🚫 NÃO chama Mercado Pago.
| ✔ Usado apenas para testes / primeira versão (Plano B).
|--------------------------------------------------------------------------
*/
export const gerarPagamento = async (req, res) => {
  try {
    const { inscricaoId } = req.body;

    // 1) Validação básica
    if (!inscricaoId) {
      return res.status(400).json({
        erro: "O campo 'inscricaoId' é obrigatório.",
      });
    }

    // 2) Buscar inscrição no banco
    const inscricao = await Inscricao.findById(inscricaoId)
      .populate("concursoId")
      .populate("cargoId");

    if (!inscricao) {
      return res.status(404).json({
        erro: "Inscrição não encontrada.",
      });
    }

    // 3) Verificar se já está paga
    if (inscricao.paymentStatus === "pago" || inscricao.statusPagamento === "pago") {
      return res.status(400).json({
        erro: "Esta inscrição já está paga.",
      });
    }

    // 4) Gerar dados FAKES de pagamento (Plano B)
    const fakePaymentId = `SIMULADO-${Date.now()}`;

    inscricao.paymentId = fakePaymentId;
    inscricao.paymentInitPoint = null; // não usamos link externo
    inscricao.paymentStatus = "pago";  // campo em inglês
    inscricao.statusPagamento = "pago"; // campo em português (usado em algumas telas)
    inscricao.paymentMethod = "simulado"; // só pra registrar
    inscricao.paymentDate = new Date();   // data/hora do "pagamento"

    await inscricao.save();

    // 5) Resposta para o frontend
    return res.json({
      mensagem: "Pagamento registrado com sucesso (SIMULADO - Plano B).",
      status: "pago",
      inscricaoId: inscricao._id,
      paymentId: fakePaymentId,
    });

  } catch (error) {
    console.error("❌ ERRO AO GERAR PAGAMENTO (PLANO B):", error);
    return res.status(500).json({
      erro: "Erro interno ao gerar pagamento (Plano B).",
      detalhes: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 🟦 2) WEBHOOK DO MERCADO PAGO (DESATIVADO NO PLANO B)
|--------------------------------------------------------------------------
| POST /api/pagamentos/webhook
|
| Mantemos a rota apenas para compatibilidade futura,
| mas no Plano B ela só registra o payload e responde OK.
|--------------------------------------------------------------------------
*/
export const receberWebhook = (req, res) => {
  console.log("📩 Webhook recebido (ignorado no Plano B):", req.body);
  return res.status(200).send("OK (webhook simulado - Plano B)");
};

/*
|--------------------------------------------------------------------------
| 🟦 3) TELAS DE RETORNO (OPCIONAIS)
|--------------------------------------------------------------------------
| Essas rotas podem ser usadas pelo frontend, se quiser,
| mas no Plano B o fluxo principal já é resolvido direto na API.
|--------------------------------------------------------------------------
*/
export const retornoSucesso = (req, res) => {
  return res.json({
    status: "success",
    mensagem: "Pagamento aprovado (simulado).",
  });
};

export const retornoFalha = (req, res) => {
  return res.json({
    status: "failure",
    mensagem: "Pagamento não foi concluído (simulado).",
  });
};

export const retornoPendente = (req, res) => {
  return res.json({
    status: "pending",
    mensagem: "Pagamento pendente (simulado).",
  });
};
