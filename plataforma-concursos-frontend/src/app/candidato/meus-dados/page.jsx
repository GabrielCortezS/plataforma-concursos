"use client";

import { useEffect, useState } from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { Button } from "../../components/ui/Button";

/*
|--------------------------------------------------------------------------
| 📌 Página: Meus Dados (Área do Candidato)
| - Mostra dados pessoais do candidato logado
| - Mostra dados da inscrição vinculada (se houver)
| - Permite ir para a tela de atualização da inscrição
|--------------------------------------------------------------------------
*/

export default function MeusDadosPage() {
  const [candidato, setCandidato] = useState(null);
  const [inscricao, setInscricao] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Token salvo no navegador
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /*
  |--------------------------------------------------------------------------
  | 🔍 Buscar dados do candidato logado + inscrição
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    async function fetchDados() {
      try {
        const res = await fetch("http://localhost:5000/api/candidato/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCandidato(data.candidato || null);
        setInscricao(data.inscricao || null);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchDados();
  }, [token]);

  /*
  |--------------------------------------------------------------------------
  | ⏳ Tela de carregamento
  |--------------------------------------------------------------------------
  */
  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  /*
  |--------------------------------------------------------------------------
  | ❌ Caso não encontre candidato ou erro no backend
  |--------------------------------------------------------------------------
  */
  if (!candidato) {
    return (
      <p className="text-center text-red-600 mt-10">
        Não foi possível carregar os dados do candidato.
      </p>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | 🎨 Interface principal
  |--------------------------------------------------------------------------
  */
  return (
    <div className="flex flex-col min-h-screen text-black">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        
        {/* 🔵 Título */}
        <h1 className="text-3xl font-bold mb-8 text-center">Meus Dados</h1>

        {/* 🧍 Dados do Candidato */}
        <section className="bg-gray-100 p-6 rounded shadow mb-10">
          <h2 className="text-xl font-semibold mb-4">Dados do Candidato</h2>

          <p><strong>Nome:</strong> {candidato.nome}</p>
          <p><strong>E-mail:</strong> {candidato.email}</p>
          <p><strong>CPF:</strong> {candidato.cpf || "Não informado"}</p>

          <p className="mt-2">
            <strong>Data de Cadastro:</strong>{" "}
            {new Date(candidato.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </section>

        {/* 📄 Dados da Inscrição */}
        <section className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Minha Inscrição</h2>

          {!inscricao ? (
            <p className="text-gray-600">Nenhuma inscrição encontrada.</p>
          ) : (
            <>
              {/* Concurso */}
              <p>
                <strong>Concurso:</strong>{" "}
                {inscricao.concursoId?.titulo || "—"}
              </p>

              {/* Cargo — CAMPO CORRIGIDO */}
              <p>
                <strong>Cargo:</strong>{" "}
                {inscricao.cargoId?.nome ?? "Não informado"}
              </p>

              {/* Status */}
              <p>
                <strong>Status:</strong>{" "}
                <span className="px-2 py-1 rounded bg-blue-200 text-blue-700">
                  {inscricao.status || "Ativa"}
                </span>
              </p>

              {/* Foto */}
              {inscricao.foto && (
                <div className="mt-4">
                  <strong>Foto enviada:</strong>
                  <img
                    src={`http://localhost:5000/${inscricao.foto}`}
                    alt="Foto do candidato"
                    className="w-32 mt-2 rounded shadow"
                  />
                </div>
              )}

              {/* Botão de ação */}
              <Button
                onClick={() => {
                  window.location.href = `/candidato/editar-inscricao/${inscricao._id}`;
                }}
                className="mt-6 w-full bg-[#0b2c55] text-white py-3"
              >
                Atualizar Dados da Inscrição
              </Button>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
