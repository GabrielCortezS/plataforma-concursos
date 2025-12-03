"use client";

/*
|------------------------------------------------------------
| 🟦 Página: Editar Concurso
|------------------------------------------------------------
| Funções:
| - Carregar dados do concurso via ID
| - Preencher formulário automaticamente
| - Enviar atualização (PUT multipart/form-data)
| - Exibir documentos já enviados
| - Substituir documentos apenas se enviar novos
|------------------------------------------------------------
*/

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditarConcurso() {
  // Pega o :id da URL
  const { id } = useParams();
  const router = useRouter();

  const [concurso, setConcurso] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  |------------------------------------------------------------
  | Estados dos campos editáveis
  |------------------------------------------------------------
  */
  const [titulo, setTitulo] = useState("");
  const [orgao, setOrgao] = useState("");
  const [edital, setEdital] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [dataProva, setDataProva] = useState("");

  const [novoDocumento, setNovoDocumento] = useState(null);

  /*
  |------------------------------------------------------------
  | 🔍 Buscar concurso pelo ID
  |------------------------------------------------------------
  */
  useEffect(() => {
    if (!id) return;

    async function fetchConcurso() {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(`http://localhost:5000/api/concursos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setConcurso(data);

        // Preenchendo os inputs
        setTitulo(data.titulo ?? "");
        setOrgao(data.orgao ?? "");
        setEdital(data.edital ?? "");
        setDescricao(data.descricao ?? "");

        setDataInicio(data.dataInicioInscricao ?? "");
        setDataFim(data.dataFimInscricao ?? "");
        setDataProva(data.dataProva ?? "");

      } catch (error) {
        console.error("Erro ao carregar concurso:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConcurso();
  }, [id]);

  /*
  |------------------------------------------------------------
  | 🟦 Atualizar concurso
  |------------------------------------------------------------
  */
  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("orgao", orgao);
    formData.append("edital", edital);
    formData.append("descricao", descricao);

    formData.append("dataInicioInscricao", dataInicio);
    formData.append("dataFimInscricao", dataFim);
    formData.append("dataProva", dataProva);

    if (novoDocumento) {
      formData.append("documento", novoDocumento);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/concursos/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ NÃO COLOCAR Content-Type aqui
        },
        body: formData,
      });

      const resposta = await res.json();

      if (!res.ok) {
        alert(resposta.mensagem || "Erro ao atualizar");
        return;
      }

      alert("Concurso atualizado com sucesso!");
      router.push("/admin/concursos");

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro inesperado ao atualizar.");
    }
  }

  /*
  |------------------------------------------------------------
  | Renderização
  |------------------------------------------------------------
  */
  if (loading) return <p className="p-6">Carregando concurso...</p>;
  if (!concurso) return <p className="p-6">Concurso não encontrado.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-8">
      <h1 className="text-black text-2xl font-bold mb-6">Editar Concurso</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        {/* Título */}
        <div>
          <label className="block mb-1 font-semibold text-black">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-2 border rounded text-black placeholder:text-gray-500"
            required
          />
        </div>

        {/* Órgão */}
        <div>
          <label className="block mb-1 font-semibold text-black">Órgão</label>
          <input
            type="text"
            value={orgao}
            onChange={(e) => setOrgao(e.target.value)}
            className="w-full p-2 border rounded text-black placeholder:text-gray-500"
          />
        </div>

        {/* Edital */}
        <div>
          <label className="block mb-1 font-semibold text-black">Edital</label>
          <input
            type="text"
            value={edital}
            onChange={(e) => setEdital(e.target.value)}
            className="w-full p-2 border rounded text-black placeholder:text-gray-500"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block mb-1 font-semibold text-black">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full p-2 border rounded h-32 text-black placeholder:text-gray-500"
          ></textarea>
        </div>

        {/* Datas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-semibold text-black">
              Início das Inscrições
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-black">
              Fim das Inscrições
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-black">
              Data da Prova
            </label>
            <input
              type="date"
              value={dataProva}
              onChange={(e) => setDataProva(e.target.value)}
              className="w-full p-2 border rounded text-black"
            />
          </div>
        </div>

        {/* Documentos atuais */}
        {concurso.documentos?.length > 0 && (
          <div>
            <p className="font-semibold mb-2 text-black">Documentos atuais:</p>
            <ul className="ml-4 list-disc">
              {concurso.documentos.map((doc, index) => (
                <li key={index}>
                  <a
                    href={`http://localhost:5000/${doc.caminho}`}
                    target="_blank"
                    className="text-blue-700 underline"
                  >
                    {doc.nome}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Enviar novo documento */}
        <div>
          <label className="block font-semibold mb-1 text-black">
            Substituir / Adicionar documento
          </label>
          <input
            type="file"
            onChange={(e) => setNovoDocumento(e.target.files[0])}
            className="w-full text-black"
          />
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="bg-[#0b2c55] text-white px-6 py-2 rounded hover:bg-[#081c38]"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
