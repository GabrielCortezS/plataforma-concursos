"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";

/*
|---------------------------------------------------------
| 🎉 Tela exibida após a inscrição ser concluída
| - Recupera comprovante salvo no localStorage
| - Exibe botão para download caso exista
|---------------------------------------------------------
*/

export default function SucessoInscricaoPage() {
  const [comprovanteUrl, setComprovanteUrl] = useState(null);

  /*
  |---------------------------------------------------------
  | Recupera o PDF salvo no localStorage
  | (A defasagem evita o warning do ESLint)
  |---------------------------------------------------------
  */
  useEffect(() => {
    const timer = setTimeout(() => {
      const url = localStorage.getItem("comprovantePdf");
      if (url) setComprovanteUrl(url);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-black">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-6 py-14 text-center">

        {/* Título */}
        <h1 className="text-3xl font-bold text-[#0b2c55]">
          Inscrição concluída!
        </h1>

        {/* Mensagem */}
        <p className="mt-4 text-lg text-gray-700">
          Sua inscrição foi registrada com sucesso no sistema INEPAS.
        </p>

        <p className="mt-2 text-gray-600">
          Você receberá atualizações futuras sobre o concurso através do e-mail cadastrado.
        </p>

        {/* Botão para baixar comprovante */}
        {comprovanteUrl && (
          <div className="mt-8">
            <a
              href={comprovanteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              📄 Baixar comprovante de inscrição
            </a>
          </div>
        )}

        {/* Botão para área do candidato */}
        <div className="mt-6">
          <Link
            href="/candidato"
            className="bg-[#0b2c55] text-white px-6 py-3 rounded-md hover:bg-[#081c38] transition"
          >
            Ir para área do candidato
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
