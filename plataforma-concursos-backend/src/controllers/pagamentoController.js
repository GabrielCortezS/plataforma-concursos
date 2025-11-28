// src/controllers/pagamentoController.js
// Controller responsável por gerar pagamento via Mercado Pago (Checkout Pro)

import Inscricao from "../models/Inscricao.js";
import { criarPreferenciaPagamento } from "../services/mercadoPago.js";

/*
|------------------------------------------------------------------
| POST /api/pagamentos/gerar
|------------------------------------------------------------------
| Gera uma preferência de pagamento no Mercado Pago e salva
| os dados essenciais dentro da inscrição.
| A rota é protegida (candidato precisa estar logado).
*/
export const gerarPagamento = async (req, res) => {
  try {
    const { inscricaoId } = req.body;

    /*
    |--------------------------------------------------------------
    | 1) Validação básica
    |--------------------------------------------------------------
    */
    if (!inscricaoId) {
      return res.status(400).json({
        erro: "O campo 'inscricaoId' é obrigatório.",
      });
    }

    /*
    |--------------------------------------------------------------
    | 2) Buscar inscrição completa (populate concurso e cargo)
    |--------------------------------------------------------------
    */
    const inscricao = await Inscricao.findById(inscricaoId)
      .populate("concursoId")
      .populate("cargoId");

    if (!inscricao) {
      return res.status(404).json({
        erro: "Inscrição não encontrada.",
      });
    }

    /*
    |--------------------------------------------------------------
    | 3) Impedir criação de pagamento duplicado
    |--------------------------------------------------------------
    */
    if (inscricao.paymentStatus === "pago") {
      return res.status(400).json({
        erro: "Pagamento já realizado para esta inscrição.",
      });
    }

    /*
    |--------------------------------------------------------------
    | 4) Criar a preferência no Mercado Pago
    |--------------------------------------------------------------
    | A função criarPreferenciaPagamento() retorna um objeto completo
    | contendo response.body.id, response.body.init_point etc.
    */
    const response = await criarPreferenciaPagamento(inscricao);

    // Segurança: caso a SDK não retorne body
    if (!response || !response.body) {
      return res.status(500).json({
        erro: "Não foi possível criar o pagamento no Mercado Pago.",
      });
    }

    /*
    |--------------------------------------------------------------
    | 5) Extrair dados importantes do retorno do Mercado Pago
    |--------------------------------------------------------------
    */
    const paymentId = response.body.id;
    const initPoint = response.body.init_point;

    if (!paymentId || !initPoint) {
      return res.status(500).json({
        erro: "Falha ao gerar link de pagamento.",
      });
    }

    /*
    |--------------------------------------------------------------
    | 6) Salvar dados do pagamento dentro da inscrição
    |--------------------------------------------------------------
    */
    inscricao.paymentId = paymentId;
    inscricao.paymentInitPoint = initPoint;
    inscricao.paymentStatus = "pendente";
    await inscricao.save();

    /*
    |--------------------------------------------------------------
    | 7) Resposta final para o frontend
    |--------------------------------------------------------------
    */
    return res.json({
      mensagem: "Pagamento criado com sucesso!",
      paymentId: paymentId,
      init_point: initPoint, // URL para redirecionar o candidato
    });

  } catch (error) {
    console.error("Erro ao gerar pagamento:", error);

    return res.status(500).json({
      erro: "Erro interno ao gerar pagamento.",
      detalhes: error.message,
    });
  }
};
