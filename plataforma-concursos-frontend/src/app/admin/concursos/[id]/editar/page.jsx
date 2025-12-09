"use client";

/*
|======================================================================
| 🟦 Página: /admin/concursos/[id]/editar
|-----------------------------------------------------------------------
| - Carrega os dados do concurso pelo ID da URL
| - Permite editar título, descrição e datas
| - Exibe documentos já anexados
| - Faz upload correto:
|     🔹 "edital"  → PDF
|     🔹 "imagens" → imagens
| - Todos os textos ajustados para PRETO (text-black)
|======================================================================
*/

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditarConcursoPage() {
  const { id } = useParams();
  const router = useRouter();

  const [concurso, setConcurso] = useState(null);

  // Campos de edição
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicioInscricao, setDataInicioInscricao] = useState("");
  const [dataFimInscricao, setDataFimInscricao] = useState("");
  const [dataProva, setDataProva] = useState("");

  // Upload
  const [novoDocumento, setNovoDocumento] = useState(null);

  // Estados gerais
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  /*
  |----------------------------------------------------------------------
  | 🔍 Buscar concurso ao abrir página
  |----------------------------------------------------------------------
  */
  useEffect(() => {
    if (!id) return;

    const carregarConcurso = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(`http://localhost:5000/api/concursos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setErro(data.mensagem || "Erro ao carregar concurso.");
          return;
        }

        setConcurso(data);

        setTitulo(data.titulo || "");
        setDescricao(data.descricao || "");
        setDataInicioInscricao(data.dataInicioInscricao || "");
        setDataFimInscricao(data.dataFimInscricao || "");
        setDataProva(data.dataProva || "");
      } catch (e) {
        setErro("Erro ao conectar ao servidor.");
      } finally {
        setCarregando(false);
      }
    };

    carregarConcurso();
  }, [id]);

  /*
  |----------------------------------------------------------------------
  | 📎 Monta URL de download corretamente
  |----------------------------------------------------------------------
  */
  const getDownloadUrl = (doc) => {
    const nome =
      doc?.caminho?.split("/").pop() ||
      doc?.nome ||
      "";

    return `http://localhost:5000/api/concursos/download/${nome}`;
  };

  /*
  |----------------------------------------------------------------------
  | 🟦 Submit — atualizar concurso
  |----------------------------------------------------------------------
  | Ajustado para enviar:
  |   PDF → campo "edital"
  |   PNG/JPG/JPEG → campo "imagens"
  |----------------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      // Campos simples
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("dataInicioInscricao", dataInicioInscricao);
      formData.append("dataFimInscricao", dataFimInscricao);
      formData.append("dataProva", dataProva);

      // Upload correto
      if (novoDocumento) {
        const tipo = novoDocumento.type;

        if (tipo === "application/pdf") {
          formData.append("edital", novoDocumento); // campo correto
        } else {
          formData.append("imagens", novoDocumento); // campo correto
        }
      }

      const res = await fetch(`http://localhost:5000/api/concursos/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.mensagem || "Erro ao atualizar concurso.");
        return;
      }

      setSucesso("Concurso atualizado com sucesso!");

      setTimeout(() => router.push("/admin/concursos"), 1200);
    } catch (err) {
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return <p className="p-6 text-black">Carregando...</p>;
  if (!concurso)
    return <p className="p-6 text-red-600 text-black">Concurso não encontrado.</p>;

  return (
    <div className="p-6 max-w-3xl text-black">
      <h1 className="text-xl font-semibold mb-6 text-black">Editar Concurso</h1>

      {/* Erro */}
      {erro && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 mb-4 rounded text-black">
          {erro}
        </div>
      )}

      {/* Sucesso */}
      {sucesso && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-3 mb-4 rounded text-black">
          {sucesso}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6 text-black"
      >
        {/* Título */}
        <div>
          <label className="font-semibold text-black">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded text-black placeholder:text-gray-500"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="font-semibold text-black">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border rounded h-32 text-black placeholder:text-gray-500"
          ></textarea>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="font-semibold text-black">Início das inscrições</label>
            <input
              type="date"
              value={dataInicioInscricao}
              onChange={(e) => setDataInicioInscricao(e.target.value)}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="font-semibold text-black">Fim das inscrições</label>
            <input
              type="date"
              value={dataFimInscricao}
              onChange={(e) => setDataFimInscricao(e.target.value)}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="font-semibold text-black">Data da prova</label>
            <input
              type="date"
              value={dataProva}
              onChange={(e) => setDataProva(e.target.value)}
              className="w-full p-2 border rounded text-black"
            />
          </div>
        </div>

        {/* Documentos atuais */}
        <div className="border-t pt-4">
          <p className="font-semibold text-black">Documentos atuais:</p>

          {concurso.documentos?.length ? (
            <ul className="list-disc ml-6 mt-2">
              {concurso.documentos.map((doc, i) => {
                const nome = doc?.caminho?.split("/").pop();
                return (
                  <li key={i} className="text-black">
                    {nome} —
                    <a
                      href={getDownloadUrl(doc)}
                      target="_blank"
                      className="text-blue-700 hover:underline ml-1"
                    >
                      Baixar
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-black text-sm">Nenhum documento anexado.</p>
          )}
        </div>

        {/* Novo documento */}
        <div>
          <label className="font-semibold text-black">
            Substituir / adicionar documento
          </label>
          <input
            type="file"
            onChange={(e) => setNovoDocumento(e.target.files[0])}
            className="w-full text-black mt-1"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={salvando}
          className="bg-[#0b2c55] text-white px-6 py-2 rounded hover:bg-[#081c38]"
        >
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
