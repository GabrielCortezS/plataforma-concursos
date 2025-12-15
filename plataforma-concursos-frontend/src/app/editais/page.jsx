"use client";

import { useEffect, useState } from "react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import Card from "../components/ui/Card";

/*
|---------------------------------------------------------
| 📄 Página: Editais Disponíveis
|---------------------------------------------------------
| - Lista editais públicos vindos do backend
| - Usa o PRIMEIRO documento do concurso como edital
| - Download direto via /uploads
|---------------------------------------------------------
*/

export default function EditaisPage() {
  const [concursos, setConcursos] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  |---------------------------------------------------------
  | 🔍 Buscar concursos
  |---------------------------------------------------------
  */
  useEffect(() => {
    async function fetchConcursos() {
      try {
        const res = await fetch("http://localhost:5000/api/concursos");
        const data = await res.json();

        /*
        |---------------------------------------------------------
        | Filtra apenas concursos que possuem documentos
        |---------------------------------------------------------
        */
        const concursosComEdital = data.filter(
          (concurso) =>
            Array.isArray(concurso.documentos) &&
            concurso.documentos.length > 0
        );

        setConcursos(concursosComEdital);
      } catch (error) {
        console.error("Erro ao buscar editais:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConcursos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-10">
        {/* Título */}
        <h1 className="text-3xl font-bold text-[#0b2c55] mb-4">
          Editais Disponíveis
        </h1>

        {/* Descrição */}
        <p className="text-gray-600 mb-8">
          Aqui você encontra todos os editais disponíveis para download
          de forma rápida e organizada.
        </p>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-500">
            Carregando editais...
          </p>
        )}

        {/* Lista */}
        <div className="grid gap-6">
          {!loading && concursos.length === 0 && (
            <p className="text-center text-gray-500">
              Nenhum edital disponível no momento.
            </p>
          )}

          {concursos.map((concurso) => {
            const edital = concurso.documentos[0]; // 📄 primeiro documento

            return (
              <Card key={concurso._id}>
                <h2 className="text-xl font-semibold text-black">
                  {concurso.titulo}
                </h2>

                <p className="text-sm text-black mt-2">
                  Edital publicado em{" "}
                  {new Date(concurso.createdAt).toLocaleDateString("pt-BR")}
                </p>

                {/* Download do edital */}
                <a
                  href={`http://localhost:5000/${edital.caminho}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
                >
                  📄 Baixar Edital
                </a>
              </Card>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
