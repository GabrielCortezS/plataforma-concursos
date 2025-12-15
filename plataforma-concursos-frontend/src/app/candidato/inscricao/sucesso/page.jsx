"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";

/*
|---------------------------------------------------------
| 🎉 Tela exibida após a inscrição ser concluída
| - Exibe botão para download do comprovante
| - Download é feito via fetch + blob (rota protegida)
|---------------------------------------------------------
*/

export default function SucessoInscricaoPage() {
  const [inscricaoId, setInscricaoId] = useState(null);
  const [erro, setErro] = useState("");

  /*
  |---------------------------------------------------------
  | Recupera o ID da inscrição salvo no localStorage
  |---------------------------------------------------------
  */
  useEffect(() => {
    const id = localStorage.getItem("inscricaoId");
    if (id) setInscricaoId(id);
  }, []);

  /*
  |---------------------------------------------------------
  | 📄 Download seguro do comprovante (JWT + Blob)
  |---------------------------------------------------------
  */
  const baixarComprovante = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !inscricaoId) {
        setErro("Não foi possível baixar o comprovante.");
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/inscricoes/comprovante/${inscricaoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao baixar comprovante.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "comprovante-inscricao.pdf";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErro("Erro ao baixar comprovante.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-black">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-6 py-14 text-center">
        <h1 className="text-3xl font-bold text-[#0b2c55]">
          Inscrição concluída!
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          Sua inscrição foi registrada com sucesso no sistema INEPAS.
        </p>

        <p className="mt-2 text-gray-600">
          Você receberá atualizações futuras sobre o concurso por e-mail.
        </p>

        {/* Erro */}
        {erro && (
          <p className="mt-4 text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-sm">
            {erro}
          </p>
        )}

        {/* Botão de download */}
        {inscricaoId && (
          <div className="mt-8">
            <button
              onClick={baixarComprovante}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              📄 Baixar comprovante de inscrição
            </button>
          </div>
        )}

        {/* Área do candidato */}
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
