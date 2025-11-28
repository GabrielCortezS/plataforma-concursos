// src/services/mercadoPago.js
// Serviço responsável por integrar com o Mercado Pago (SDK nova 2024+)

import { MercadoPagoConfig, Preference } from "mercadopago";

/*
|-----------------------------------------------------------------
| 🔹 Inicialização da SDK do Mercado Pago (versão nova)
|-----------------------------------------------------------------
| A SDK antiga utilizava:
|    mercadopago.configure({ access_token })
|
| Agora, desde 2024, toda a integração é feita através das classes:
|    → MercadoPagoConfig (configura o cliente)
|    → Preference (criação da preferência de pagamento)
|
| O client configurado aqui é reutilizado em todo o serviço.
*/
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN, // token definido no .env
});

/*
|-----------------------------------------------------------------
| 🔹 Função: criarPreferenciaPagamento(inscricao)
|-----------------------------------------------------------------
| Objetivo:
|   - Criar a preferência de pagamento no Mercado Pago
|   - Retornar a URL 'init_point', onde o candidato será redirecionado
|   - Armazenar IDs e status no controller
|
| Parâmetros:
|   - inscricao → objeto populado com dados do concurso e cargo
|
| Importante:
|   - O valor da inscrição vem do cargo selecionado.
|   - O Mercado Pago gera:
|        → paymentId (ID da preferência)
|        → init_point (link de pagamento)
*/
export async function criarPreferenciaPagamento(inscricao) {
  /*
  |---------------------------------------------------------------
  | 🔹 Determinar valor da inscrição
  |---------------------------------------------------------------
  | Caso o valor não exista no cargo, definimos um fallback de 10
  | apenas para evitar erro em ambiente de testes.
  */
  const valorInscricao =
    inscricao.cargoId?.valorInscricao && inscricao.cargoId.valorInscricao > 0
      ? inscricao.cargoId.valorInscricao
      : 10;

  /*
  |---------------------------------------------------------------
  | 🔹 Dados enviados ao Mercado Pago
  |---------------------------------------------------------------
  | "items" → lista de produtos/serviços da cobrança
  | "back_urls" → URLs para onde o usuário será redirecionado
  | "auto_return" → retorna automático quando pagamento aprovado
  |
  | OBS:
  |   BASE_URL deve apontar para o frontend,
  |   pois é o candidato que volta para a interface após pagar.
  */
  const preferenceData = {
    items: [
      {
        title: `Inscrição: ${inscricao.concursoId.titulo}`, // nome do concurso
        quantity: 1,
        currency_id: "BRL",
        unit_price: valorInscricao, // valor real definido no cargo
      },
    ],

    back_urls: {
      success: `${process.env.BASE_URL}/pagamento/sucesso`,
      failure: `${process.env.BASE_URL}/pagamento/falha`,
      pending: `${process.env.BASE_URL}/pagamento/pendente`,
    },

    auto_return: "approved",
  };

  /*
  |---------------------------------------------------------------
  | 🔹 Criar a preferência (SDK nova)
  |---------------------------------------------------------------
  | "Preference" é a classe responsável por lidar com pagamentos.
  | Antes da atualização da SDK, o método era:
  |    mercadopago.preferences.create()
  |
  | Agora precisamos instanciar:
  |    new Preference(client)
  |
  | E então chamar ".create({ body })"
  */
  const preference = new Preference(client);

  /*
  |---------------------------------------------------------------
  | 🔹 Chamada oficial ao Mercado Pago
  |---------------------------------------------------------------
  | A resposta contém:
  |   - response.id  → ID da preferência (paymentId)
  |   - response.init_point → URL para redirecionamento do pagamento
  |
  | Esses dados serão tratados no controller e guardados na inscrição.
  */
  const response = await preference.create({
    body: preferenceData,
  });

  // Retorna a resposta completa para o controller
  return response;
}
