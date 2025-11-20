"use client";

import { useEffect, useState } from "react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import Badge from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import Link from "next/link";

export default function ConcursosPage() {
  const [concursos, setConcursos] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  |------------------------------------------------------------
  | 🔍 Buscar todos os concursos no backend
  |------------------------------------------------------------
  */
  useEffect(() => {
    async function fetchConcursos() {
      try {
        const res = await fetch("http://localhost:5000/api/concursos");
        const data = await res.json();
        setConcursos(data);
      } catch (error) {
        console.error("Erro ao buscar concursos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConcursos();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Carregando concursos...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen"> {/* ⬅️ Footer colado no fundo */}
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12">

        <h1 className="text-3xl font-bold mb-8 text-black">
          Lista de Concursos
        </h1>

        {/* Caso não exista nenhum concurso */}
        {concursos.length === 0 && (
          <p className="text-gray-700">Nenhum concurso cadastrado.</p>
        )}

        {/* Lista de concursos */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {concursos.map((item) => (
            <div
              key={item._id}
              className="border shadow-sm rounded-md p-6 bg-white flex flex-col justify-between"
            >
              {/* Título */}
              <h2 className="text-xl font-semibold text-black mb-2">
                {item.titulo}
              </h2>

              {/* Status */}
              <div className="mb-3">
                {item.status === "aberto" && (
                  <Badge variant="success">Inscrições Abertas</Badge>
                )}
                {item.status === "encerrado" && (
                  <Badge variant="error">Encerrado</Badge>
                )}
                {item.status === "em andamento" && (
                  <Badge variant="warning">Em andamento</Badge>
                )}
              </div>

              {/* Órgão */}
              <p className="text-black text-sm">
                <strong>Órgão:</strong> {item.orgao}
              </p>

              {/* Datas principais */}
              <div className="mt-3 text-sm text-gray-800">
                <p><strong>Início:</strong> {item.dataInicioInscricao}</p>
                <p><strong>Fim:</strong> {item.dataFimInscricao}</p>
                <p><strong>Prova:</strong> {item.dataProva || "A definir"}</p>
              </div>

              {/* Botão de detalhes */}
              <Link
                href={`/concursos/${item._id}`}
                className="mt-5"
              >
                <Button className="w-full bg-[#0b2c55] text-white hover:bg-[#08305f]">
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
