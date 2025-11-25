"use client";

import { useEffect, useState } from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { Button } from "../../components/ui/Button";

/*
|--------------------------------------------------------------------------
| 📌 Página: Meus Dados (Candidato)
| - Exibe dados pessoais do candidato logado
| - Exibe informações da inscrição vinculada
| - Permite baixar o comprovante da inscrição (PDF)
|--------------------------------------------------------------------------
*/

export default function MeusDadosPage() {
  const [candidato, setCandidato] = useState(null);
  const [inscricao, setInscricao] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Token armazenado no navegador
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /*
  |--------------------------------------------------------------------------
  | 🔍 Buscar dados do candidato + inscrição vinculada
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
  | ❌ Erro ao carregar dados
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
  | 🎨 Interface Principal
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

          <p>
            <strong>Nome:</strong> {candidato.nome}
          </p>
          <p>
            <strong>E-mail:</strong> {candidato.email}
          </p>
          <p>
            <strong>CPF:</strong> {candidato.cpf || "Não informado"}
          </p>

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
                <strong>Concurso:</strong> {inscricao.concursoId?.titulo || "—"}
              </p>

              {/* Cargo */}
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

              {/* Foto enviada */}
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

              {/* 
              --------------------------------------------------------------------------
              | 📄 Botão para baixar comprovante da inscrição
              | - Agora é o único botão disponível
              --------------------------------------------------------------------------
              */}
              <Button
  className="mt-6 w-full bg-green-600 text-white py-3"
  onClick={async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/inscricoes/comprovante/${inscricao._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        alert("Erro ao baixar comprovante.");
        return;
      }

      // Recebe PDF como blob
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Cria download
      const a = document.createElement("a");
      a.href = url;
      a.download = `comprovante_${inscricao._id}.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro no download:", error);
      alert("Não foi possível baixar o comprovante.");
    }
  }}
>
  Baixar Comprovante de Inscrição
</Button>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
