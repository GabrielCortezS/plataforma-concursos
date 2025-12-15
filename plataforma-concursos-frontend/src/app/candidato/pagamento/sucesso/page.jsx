"use client";

import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";
import Link from "next/link";

/*
|-----------------------------------------------------------------
| 🎉 Tela: Pagamento Aprovado
| Rota: /candidato/pagamento/sucesso
|-----------------------------------------------------------------
*/

export default function PagamentoSucessoPage() {
  return (
    <div className="flex flex-col min-h-screen text-black">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-6 py-14 text-center">
        
        {/* Ícone */}
        <div className="text-green-600 text-6xl mb-4">✔</div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-[#0b2c55]">
          Pagamento Confirmado!
        </h1>

        <p className="mt-4 text-gray-700">
          Seu pagamento foi aprovado e sua inscrição está totalmente validada.
        </p>

        <p className="text-gray-600 mt-1">
          Você receberá todas as atualizações do concurso pelo e-mail cadastrado.
        </p>

        {/* Botão */}
        <div className="mt-8">
          <Link
            href="/candidato"
            className="bg-[#0b2c55] text-white px-6 py-3 rounded-md hover:bg-[#082542] transition"
          >
            Ir para Área do Candidato
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
