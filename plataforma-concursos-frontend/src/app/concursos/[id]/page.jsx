"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "../../components/ui/Header"
import Badge from "../../components/ui/Badge"
import Footer from "../../components/ui/Footer";
import { Button } from "../../components/ui/Button";


// Função para formatar datas (DD/MM/YYYY)
function formatarData(data) {
  if (!data) return "—";
  return new Date(data).toLocaleDateString("pt-BR");
}

export default function ConcursoDetalhes() {
  const { id } = useParams(); 
  const router = useRouter(); 
  const [concurso, setConcurso] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica se existe token
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // Buscar o concurso
  useEffect(() => {
    async function fetchConcurso() {
      try {
        const res = await fetch(`http://localhost:5000/api/concursos/${id}`);
        const data = await res.json();
        setConcurso(data);
      } catch (error) {
        console.error("Erro ao buscar concurso:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConcurso();
  }, [id]);

  if (loading) {
    return <p className="text-center text-black mt-10">Carregando...</p>;
  }

  if (!concurso) {
    return <p className="text-center text-red-600 mt-10">Concurso não encontrado.</p>;
  }

  // Lógica do botão
  function handleInscricao() {
    if (!token) {
      router.push(`/candidato/login?redirect=/concursos/${id}`);
      return;
    }
    router.push(`/candidato/inscricao/${id}`);
  }

  return (
    <div className="flex flex-col min-h-screen text-black">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-6 py-12">

        <h1 className="text-3xl font-bold mb-4">{concurso.titulo}</h1>

        <div className="mb-4">
          {concurso.status === "aberto" && <Badge variant="success">Inscrições Abertas</Badge>}
          {concurso.status === "encerrado" && <Badge variant="error">Encerrado</Badge>}
        </div>

        <p className="text-lg mb-6">{concurso.descricao}</p>

        <div className="bg-gray-100 p-6 rounded-md shadow-sm mb-8">
          <p><strong>Órgão:</strong> {concurso.orgao}</p>
          <p><strong>Edital:</strong> {concurso.edital || "—"}</p>
          <p><strong>Início das Inscrições:</strong> {formatarData(concurso.dataInicioInscricao)}</p>
          <p><strong>Fim das Inscrições:</strong> {formatarData(concurso.dataFimInscricao)}</p>
          <p><strong>Data da Prova:</strong> {formatarData(concurso.dataProva)}</p>
        </div>

        <Button
          onClick={handleInscricao}
          className="w-full bg-[#0b2c55] text-white py-3 mb-12"
        >
          {token ? "Preencher Inscrição" : "Realizar Inscrição"}
        </Button>

        <section>
          <h2 className="text-xl font-semibold mb-3">Documentos do Concurso</h2>

          {concurso.documentos?.length === 0 && (
            <p className="text-gray-700">Nenhum documento disponível.</p>
          )}

          <ul className="flex flex-col gap-2">
            {concurso.documentos?.map((doc) => (
              <li key={doc._id} className="flex items-center justify-between p-3 border rounded-md">
                <span>📄 {doc.nome}</span>
                <a
                  href={`http://localhost:5000/${doc.caminho}`}
                  target="_blank"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Abrir
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
