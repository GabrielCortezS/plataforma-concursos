// src/services/mercadoPago.js
// Serviço oficial de integração com o Mercado Pago (SDK Nova 2024+)

import { MercadoPagoConfig, Preference } from "mercadopago";

/*
|--------------------------------------------------------------------------
| 🔧 Inicialização da SDK do Mercado Pago
|--------------------------------------------------------------------------
| O Token utilizado vem do .env:
|   MP_ACCESS_TOKEN=xxxx
|
| IMPORTANTE:
| - Esse token pode ser TESTE (TEST-xxx) ou PRODUÇÃO (APP_USR-xxx)
| - O SDK novo aceita apenas campo "accessToken"
|--------------------------------------------------------------------------
*/
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN, // ✔ O CERTO!
});

/*
|--------------------------------------------------------------------------
| 🔹 Função: criarPreferenciaPagamento(inscricao)
|--------------------------------------------------------------------------
| Recebe a inscrição populada (concurso + cargo)
| Gera a preferência no Mercado Pago e retorna:
|  - id          → ID da preferência (paymentId)
|  - init_point  → link onde o usuário realiza o pagamento
|--------------------------------------------------------------------------
*/
export async function criarPreferenciaPagamento(inscricao) {

  /*
  |--------------------------------------------------------------------------
  | 🔢 Valor da inscrição
  |--------------------------------------------------------------------------
  | Se o cargo não tiver valor definido, usamos 10 (valor fictício).
  */
  const valorInscricao =
    inscricao.cargoId?.valorInscricao > 0
      ? inscricao.cargoId.valorInscricao
      : 10;


  /*
  |--------------------------------------------------------------------------
  | 📦 Dados enviados ao Mercado Pago
  |--------------------------------------------------------------------------
  */
  const preferenceData = {
    items: [
      {
        title: `Inscrição: ${inscricao.concursoId.titulo}`,
        quantity: 1,
        unit_price: Number(valorInscricao),
        currency_id: "BRL",
      },
    ],

    back_urls: {
      success: `${process.env.BASE_URL}/pagamento/sucesso`,
      failure: `${process.env.BASE_URL}/pagamento/falha`,
      pending: `${process.env.BASE_URL}/pagamento/pendente`,
    },

    // Retorno automático ao seu site
    auto_return: "approved",
  };


  /*
  |--------------------------------------------------------------------------
  | 🧾 Criando preferência (SDK nova)
  |--------------------------------------------------------------------------
  | ANTIGO:
  |   mercadopago.preferences.create()
  |
  | NOVO (2024+):
  |   const pref = new Preference(client);
  |   pref.create({ body })
  |
  | Retorno da SDK NOVA:
  | {
  |   id: "123",
  |   init_point: "https://pagamento...",
  |   sandbox_init_point: "https://..."
  | }
  |--------------------------------------------------------------------------
  */
  const preference = new Preference(client);

  const response = await preference.create({
    body: preferenceData,
  });

  /*
  |--------------------------------------------------------------------------
  | Retorno para o Controller
  |--------------------------------------------------------------------------
  */
  return {
    id: response.id,
    init_point: response.init_point,
    sandbox_init_point: response.sandbox_init_point,
  };
}
