"use client";

/*
|------------------------------------------------------------
| 🟦 Página: /admin/cargos
|------------------------------------------------------------
| Lista todos os cargos cadastrados no sistema.
|------------------------------------------------------------
*/

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminCargosPage() {
  const [cargos, setCargos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const fetchCargos = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch("http://localhost:5000/api/cargos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return setErro(data.mensagem || "Erro ao buscar cargos.");

      setCargos(data);
    } catch (error) {
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    fetchCargos();
  }, []);

  const excluirCargo = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este cargo?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`http://localhost:5000/api/cargos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return alert(data.mensagem || "Erro ao excluir cargo.");

      alert("Cargo excluído com sucesso!");
      fetchCargos();
    } catch (error) {
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="p-6">

      {/* Título + Botão */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-800">Cargos</h1>

        <Link
          href="/admin/cargos/novo"
          className="bg-[#0b2c55] text-white px-4 py-2 rounded hover:bg-[#081c38] transition"
        >
          + Novo Cargo
        </Link>
      </div>

      {/* Erro */}
      {erro && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4 text-sm">
          {erro}
        </div>
      )}

      {/* Loading */}
      {carregando && <p>Carregando cargos...</p>}

      {/* Nenhum */}
      {!carregando && cargos.length === 0 && (
        <p className="text-gray-600">Nenhum cargo cadastrado.</p>
      )}

      {/* Tabela */}
      {!carregando && cargos.length > 0 && (
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="w-full text-sm text-gray-800">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-3">Cargo</th>
                <th className="px-4 py-3">Concurso</th>
                <th className="px-4 py-3">Vagas</th>
                <th className="px-4 py-3">Ações</th>
              </tr>
            </thead>

            <tbody>
              {cargos.map((cargo) => (
                <tr key={cargo._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{cargo.nome}</td>
                  <td className="px-4 py-3">{cargo.concursoId?.titulo}</td>
                  <td className="px-4 py-3">{cargo.vagas}</td>

                  <td className="px-4 py-3 space-x-3">
                    <Link
                      href={`/admin/cargos/${cargo._id}/editar`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>

                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => excluirCargo(cargo._id)}
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
