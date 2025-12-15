"use client";

import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";
import Link from "next/link";

/*
|-----------------------------------------------------------------
| ❌ Tela: Pagamento Falhou
| Rota: /candidato/pagamento/falha
|-----------------------------------------------------------------
*/

export default function PagamentoFalhaPage() {
  return (
    <div className="flex flex-col min-h-screen text-black">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-6 py-14 text-center">

        {/* Ícone */}
        <div className="text-red-600 text-6xl mb-4">✖</div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-red-700">
          Pagamento Não Concluído
        </h1>

        <p className="mt-4 text-gray-700">
          O pagamento não foi finalizado ou ocorreu algum problema.
        </p>

        <p className="text-gray-600 mt-1">
          Você pode tentar novamente clicando no botão abaixo.
        </p>

        {/* Botão */}
        <div className="mt-8">
          <Link
            href="/candidato/inscricoes"
            className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition"
          >
            Voltar às Inscrições
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
