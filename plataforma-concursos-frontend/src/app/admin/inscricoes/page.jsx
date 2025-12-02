"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../../components/ui/Footer";

export default function AdminInscricoes() {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | 🔍 Carregar inscrições (ADMIN)
  |--------------------------------------------------------------------------
  | A rota oficial no backend para o administrador é:
  | GET http://localhost:5000/api/inscricoes/admin
  |
  | Aqui buscamos todas as inscrições, incluindo:
  | - dados do candidato
  | - concurso selecionado
  | - cargo escolhido
  | - status de pagamento
  |
  | O adminToken garante que apenas administradores autenticados
  | possam acessar esses dados.
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    async function fetchInscricoes() {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch("http://localhost:5000/api/inscricoes/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // Garante que sempre trabalhamos com um array
        setInscricoes(data.inscricoes || []);
      } catch (error) {
        console.error("Erro ao carregar inscrições:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInscricoes();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Carregando inscrições...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* 
      |--------------------------------------------------------------------------
      | 📌 CONTEÚDO PRINCIPAL DA TELA
      |--------------------------------------------------------------------------
      | Como já temos o Sidebar fixo no layout /admin/layout.jsx,
      | aqui exibimos apenas o conteúdo da página.
      |--------------------------------------------------------------------------
      */}
      <main className="flex-1 p-8">

        {/* Título da página */}
        <h1 className="text-black text-2xl font-bold mb-6">Inscrições</h1>

        {/* 
        |--------------------------------------------------------------------------
        | 📋 Tabela de Inscrições
        |--------------------------------------------------------------------------
        | Exibe:
        | - Nome do candidato
        | - Concurso
        | - Cargo
        | - Status do pagamento
        | - Ações (ver detalhes, foto e comprovante)
        |--------------------------------------------------------------------------
        */}
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
                  <td className="py-3">{item.concursoId?.titulo}</td>
                  <td className="py-3">{item.cargoId?.nome}</td>

                  {/* Badge de pagamento */}
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

                  {/* Ações */}
                  <td className="py-3 flex gap-4">

                    {/* Ver detalhes da inscrição */}
                    <Link
                      href={`/admin/inscricoes/${item._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver
                    </Link>

                    {/* Download da foto */}
                    <a
                      href={`http://localhost:5000/api/inscricoes/foto/${item._id}`}
                      className="text-purple-600 hover:underline"
                      target="_blank"
                    >
                      Foto
                    </a>

                    {/* Download do comprovante PDF */}
                    <a
                      href={`http://localhost:5000/api/inscricoes/comprovante/${item._id}`}
                      className="text-orange-600 hover:underline"
                      target="_blank"
                    >
                      Comprovante
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Rodapé padrão do sistema */}
      <Footer />
    </div>
  );
}
