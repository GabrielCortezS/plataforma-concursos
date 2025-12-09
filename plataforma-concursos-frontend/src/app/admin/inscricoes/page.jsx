"use client";

/*
|--------------------------------------------------------------------------
| 📄 Tela: Lista de Inscrições — Painel Admin
|--------------------------------------------------------------------------
| - Mostra todas as inscrições cadastradas.
| - A busca é feita pela rota oficial do backend:
|     GET /api/inscricoes/admin
|
| - Apenas administradores logados (adminToken) podem acessar.
| - Nesta tela exibimos:
|     ✔ Candidato
|     ✔ Concurso
|     ✔ Cargo
|     ✔ Status do pagamento
|     ✔ Botão "Ver" (detalhes completos)
|
| - *Atenção:* Botões de baixar foto/comprovante agora ficam SOMENTE
|   na página de detalhes, conforme sua solicitação.
|--------------------------------------------------------------------------
*/

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../../components/ui/Footer";

export default function AdminInscricoes() {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | 🔄 Carregar lista de inscrições (ADMIN)
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    async function fetchInscricoes() {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch("http://localhost:5000/api/inscricoes/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setInscricoes(data.inscricoes || []);
      } catch (error) {
        console.error("Erro ao carregar inscrições:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInscricoes();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | ⏳ Tela de carregamento
  |--------------------------------------------------------------------------
  */
  if (loading) {
    return <p className="text-center mt-10">Carregando inscrições...</p>;
  }

  /*
  |--------------------------------------------------------------------------
  | 🖥 Tela principal
  |--------------------------------------------------------------------------
  */
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* Conteúdo */}
      <main className="flex-1 p-8">
        <h1 className="text-black text-2xl font-bold mb-6">Inscrições</h1>

        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
          <table className="min-w-full">
            <thead>
              <tr className="text-black border-b">
                <th className="py-3 text-left">Candidato</th>
                <th className="py-3 text-left">Concurso</th>
                <th className="py-3 text-left">Cargo</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Ações</th>
              </tr>
            </thead>

            <tbody>
              {inscricoes.map((item) => (
                <tr
                  key={item._id}
                  className="text-black border-b hover:bg-gray-50"
                >
                  <td className="py-3">{item.nomeCompleto}</td>

                  <td className="py-3">
                    {item.concursoId?.titulo || "—"}
                  </td>

                  <td className="py-3">
                    {item.cargoId?.nome || "—"}
                  </td>

                  {/* Status do pagamento */}
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded text-white text-sm ${
                        item.statusPagamento === "pago"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {item.statusPagamento || "não pago"}
                    </span>
                  </td>

                  {/* ✔ Ações — Apenas botão "Ver" */}
                  <td className="py-3">
                    <Link
                      href={`/admin/inscricoes/${item._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
}
