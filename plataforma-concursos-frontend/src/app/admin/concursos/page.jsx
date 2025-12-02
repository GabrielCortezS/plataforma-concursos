"use client";

/*
|------------------------------------------------------------
| 🟦 Página: /admin/concursos
|------------------------------------------------------------
*/

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminConcursosPage() {
  const [concursos, setConcursos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // 🔍 Buscar concursos
  const fetchConcursos = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch("http://localhost:5000/api/concursos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return setErro(data.mensagem);

      setConcursos(data);
    } catch (error) {
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchConcursos();
  }, []);

  // 🗑 Excluir concurso
  const excluirConcurso = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este concurso?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`http://localhost:5000/api/concursos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return alert(data.mensagem);

      alert("Concurso excluído com sucesso!");
      fetchConcursos();
    } catch (error) {
      alert("Erro ao conectar ao servidor.");
    }
  };

  // 🧩 Layout
  return (
    <div className="p-6">

      {/* Título + Botão */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-800">Concursos</h1>

        <Link
          href="/admin/concursos/novo"
          className="bg-[#0b2c55] text-white px-4 py-2 rounded hover:bg-[#081c38] transition"
        >
          + Novo Concurso
        </Link>
      </div>

      {/* Erro */}
      {erro && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4 text-sm">
          {erro}
        </div>
      )}

      {/* Loading */}
      {carregando && <p>Carregando concursos...</p>}

      {/* Nenhum */}
      {!carregando && concursos.length === 0 && (
        <p className="text-gray-600">Nenhum concurso cadastrado.</p>
      )}

      {/* Tabela */}
      {!carregando && concursos.length > 0 && (
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full text-sm text-gray-800">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Início das Inscrições</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {concursos.map((conc) => (
                <tr key={conc._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{conc.titulo}</td>

                  {/* 👇 Corrigido: usando dataInicioInscricao */}
                  <td className="px-4 py-3">
                    {conc.dataInicioInscricao
                      ? new Date(conc.dataInicioInscricao + "T00:00:00")
                          .toLocaleDateString("pt-BR")
                      : "-"}
                  </td>

                  <td className="px-4 py-3">{conc.status || "aberto"}</td>

                  <td className="px-4 py-3 space-x-3">
                    <Link
                      href={`/admin/concursos/${conc._id}/editar`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>

                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => excluirConcurso(conc._id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}
