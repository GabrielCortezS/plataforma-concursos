// src/app/candidato/inscricoes/page.jsx
"use client";

/*
|---------------------------------------------------------
| 📄 Tela: Minhas Inscrições
| - Lista todas as inscrições do candidato logado
| - Permite visualizar comprovante e detalhes
|---------------------------------------------------------
*/

import { useEffect, useState } from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";

export default function MinhasInscricoesPage() {
  const [inscricoes, setInscricoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarInscricoes() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/inscricoes/minhas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) setInscricoes(data.inscricoes || []);
      } catch (error) {
        console.log("Erro ao carregar inscrições:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarInscricoes();
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-black">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Minhas Inscrições</h1>

        {carregando && <p>Carregando...</p>}

        {!carregando && inscricoes.length === 0 && (
          <p className="text-gray-600">Você ainda não possui inscrições.</p>
        )}

        <div className="space-y-4">
          {inscricoes.map((item) => (
            <div
              key={item._id}
              className="p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <h2 className="text-xl font-semibold">
                {item.concursoId?.titulo}
              </h2>

              <p className="text-gray-700 mt-1">
                Cargo: <strong>{item.cargoId?.nome}</strong>
              </p>

              <p className="text-gray-600 text-sm mt-1">
                Nº da inscrição: {item.numeroInscricao}
              </p>

       <div className="mt-8">
            <a
              href={`http://localhost:5000/${item.comprovantePdf}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              📄 Baixar comprovante de inscrição
            </a>
          </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
