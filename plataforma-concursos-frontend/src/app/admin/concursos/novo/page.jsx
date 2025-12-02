"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CriarConcursoPage() {
  const router = useRouter();

  // STATES DO FORMULÁRIO
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [orgao, setOrgao] = useState("");

  const [dataInicioInscricao, setDataInicioInscricao] = useState("");
  const [dataFimInscricao, setDataFimInscricao] = useState("");
  const [dataProva, setDataProva] = useState("");

  const [edital, setEdital] = useState(null);
  const [imagens, setImagens] = useState([]);

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      // CAMPOS OBRIGATÓRIOS
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("orgao", orgao);

      formData.append("dataInicioInscricao", dataInicioInscricao);
      formData.append("dataFimInscricao", dataFimInscricao);
      formData.append("dataProva", dataProva);

      // PDF
      if (edital) {
        formData.append("edital", edital);
      }

      // IMAGENS
      imagens.forEach((img) => {
        formData.append("imagens", img);
      });

      const response = await fetch("http://localhost:5000/api/concursos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setCarregando(false);
        return setErro(data.mensagem || "Erro ao criar concurso.");
      }

      router.push("/admin/concursos");
    } catch (error) {
      console.error(error);
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="p-6">
      {/* TÍTULO */}
      <h1 className="text-lg font-semibold text-gray-800 mb-6">
        Criar Novo Concurso
      </h1>

      {/* ERRO */}
      {erro && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4 text-sm">
          {erro}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-5 max-w-3xl"
      >
        {/* TÍTULO */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Título do Concurso
          </label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm text-black"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        {/* ORGÃO */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Órgão</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm text-black"
            value={orgao}
            onChange={(e) => setOrgao(e.target.value)}
            required
          />
        </div>

        {/* DESCRIÇÃO */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Descrição</label>
          <textarea
            className="w-full border rounded p-2 text-sm h-24 text-black"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          ></textarea>
        </div>

        {/* DATAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Início das Inscrições
            </label>
            <input
              type="date"
              className="w-full border rounded p-2 text-sm text-black"
              value={dataInicioInscricao}
              onChange={(e) => setDataInicioInscricao(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Fim das Inscrições
            </label>
            <input
              type="date"
              className="w-full border rounded p-2 text-sm text-black"
              value={dataFimInscricao}
              onChange={(e) => setDataFimInscricao(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Data da Prova
            </label>
            <input
              type="date"
              className="w-full border rounded p-2 text-sm text-black"
              value={dataProva}
              onChange={(e) => setDataProva(e.target.value)}
              required
            />
          </div>
        </div>

        {/* PDF */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Edital (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            className="text-sm text-black"
            onChange={(e) => setEdital(e.target.files[0])}
          />
        </div>

        {/* IMAGENS */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Imagens (opcional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="text-sm text-black"
            onChange={(e) => setImagens([...e.target.files])}
          />
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          disabled={carregando}
          className="bg-[#0b2c55] text-white px-4 py-2 rounded text-sm hover:bg-[#081c38] transition"
        >
          {carregando ? "Salvando..." : "Criar Concurso"}
        </button>
      </form>
    </div>
  );
}
