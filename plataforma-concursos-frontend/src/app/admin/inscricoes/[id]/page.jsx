"use client";

/*
|--------------------------------------------------------------------------
| 📄 Tela: Ver Inscrição (Admin)
| Arquivo: /admin/inscricoes/[id]/page.jsx
| Objetivo:
|   - Exibir dados completos da inscrição
|   - Baixar foto e comprovante com token no HEADER (não na URL)
|--------------------------------------------------------------------------
*/

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VerInscricaoPage() {
  const { id } = useParams();           // ID da inscrição vindo da rota dinâmica
  const router = useRouter();

  const [inscricao, setInscricao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  /*
  |--------------------------------------------------------------------------
  | 🔐 Verificar se admin está logado
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) router.push("/admin/login");
  }, []);

  /*
  |--------------------------------------------------------------------------
  | 🔄 Buscar inscrição no backend
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    async function carregar() {
      try {
        const token = localStorage.getItem("adminToken");

        const resposta = await fetch(
          `http://localhost:5000/api/inscricoes/admin/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const dados = await resposta.json();

        if (!resposta.ok) throw new Error(dados.mensagem);

        setInscricao(dados);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id]);

  if (carregando) return <p className="p-6">Carregando...</p>;
  if (!inscricao) return <p className="p-6 text-red-600">Erro: {erro}</p>;

  /*
  |--------------------------------------------------------------------------
  | 📸 Função para BAIXAR FOTO usando token via FETCH
  |--------------------------------------------------------------------------
  */
  const baixarFoto = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `http://localhost:5000/api/inscricoes/foto/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) throw new Error("Erro ao baixar foto");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "foto-3x4.jpg";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erro ao baixar foto.");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | 📄 Função para BAIXAR COMPROVANTE via FETCH com token
  |--------------------------------------------------------------------------
  */
  const baixarComprovante = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(
        `http://localhost:5000/api/inscricoes/comprovante/admin/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) throw new Error("Erro ao baixar comprovante");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "comprovante.pdf";
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erro ao baixar comprovante.");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | 🖥️ Renderização completa da página
  |--------------------------------------------------------------------------
  */
  return (
    <div className="p-6 max-w-4xl mx-auto text-black">

      {/* Voltar */}
      <button
        onClick={() => router.push("/admin/inscricoes")}
        className="text-blue-600 hover:underline mb-6"
      >
        ← Voltar
      </button>

      <h1 className="text-2xl font-bold mb-6">Detalhes da Inscrição</h1>

      {/* Dados do Candidato */}
      <section className="bg-white shadow rounded-lg p-5 mb-6">
        <h2 className="text-xl font-semibold mb-4">Dados do Candidato</h2>
        <p><strong>Nº Inscrição:</strong> {inscricao.numeroInscricao}</p>
        <p><strong>Nome:</strong> {inscricao.nomeCompleto}</p>
        <p><strong>CPF:</strong> {inscricao.cpf}</p>
        <p><strong>Email:</strong> {inscricao.email}</p>
        <p><strong>Telefone:</strong> {inscricao.telefone}</p>
      </section>

      {/* Concurso e Cargo */}
      <section className="bg-white shadow rounded-lg p-5 mb-6">
        <h2 className="text-xl font-semibold mb-4">Concurso e Cargo</h2>
        <p><strong>Concurso:</strong> {inscricao.concursoId?.titulo}</p>
        <p><strong>Cargo:</strong> {inscricao.cargoId?.nome}</p>
      </section>

      {/* Sistema */}
      <section className="bg-white shadow rounded-lg p-5 mb-6">
        <h2 className="text-xl font-semibold mb-4">Informações Técnicas</h2>
        <p><strong>Status do Pagamento:</strong> {inscricao.statusPagamento}</p>
        <p><strong>Data da Inscrição:</strong> {new Date(inscricao.createdAt).toLocaleDateString()}</p>
        <p><strong>IP:</strong> {inscricao.ipConcordancia}</p>
        <p><strong>Navegador:</strong> {inscricao.userAgent}</p>
      </section>

      {/* Documentos */}
      <section className="bg-white shadow rounded-lg p-5 mb-6">
        <h2 className="text-xl font-semibold mb-4">Documentos</h2>

        <div className="flex gap-4">
          <button
            onClick={baixarFoto}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            📷 Ver Foto 3x4
          </button>

          <button
            onClick={baixarComprovante}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            📄 Baixar Comprovante
          </button>
        </div>
      </section>

    </div>
  );
}
