"use client";

/*
|------------------------------------------------------------
| 🟦 Página: /admin/cargos/novo
|------------------------------------------------------------
| Permite criar um novo cargo vinculado a um concurso.
| Campos compatíveis com o Model Cargo:
|  - nome (String)
|  - vagas (Number)
|  - salario (Number)
|  - requisitos (String)
|  - concursoId (ObjectId)
|------------------------------------------------------------
*/

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoCargoPage() {
  const router = useRouter();

  // Lista de concursos
  const [concursos, setConcursos] = useState([]);

  // Campos do cargo
  const [nome, setNome] = useState("");
  const [vagas, setVagas] = useState("");
  const [salario, setSalario] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [concursoId, setConcursoId] = useState("");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  /*
  |------------------------------------------------------------
  | 🔍 Buscar concursos para preencher o select
  |------------------------------------------------------------
  */
  const buscarConcursos = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch("http://localhost:5000/api/concursos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setConcursos(data);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar concursos");
    }
  };

  useEffect(() => {
    buscarConcursos();
  }, []);

  /*
  |------------------------------------------------------------
  | 🟦 Enviar formulário
  |------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch("http://localhost:5000/api/cargos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          vagas: Number(vagas),
          salario: Number(salario),
          requisitos,
          concursoId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCarregando(false);
        return setErro(data.mensagem || "Erro ao criar cargo.");
      }

      router.push("/admin/cargos");
    } catch (error) {
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  /*
  |------------------------------------------------------------
  | Renderização
  |------------------------------------------------------------
  */
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-gray-800 mb-6">
        Criar Novo Cargo
      </h1>

      {erro && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4 text-sm">
          {erro}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 space-y-5 max-w-2xl"
      >
        {/* Nome */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Nome do Cargo
          </label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm text-black"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        {/* Requisitos */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Requisitos do Cargo
          </label>
          <textarea
            className="w-full border rounded p-2 text-sm text-black h-24"
            value={requisitos}
            onChange={(e) => setRequisitos(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Vagas + Salário */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Vagas</label>
            <input
              type="number"
              className="w-full border rounded p-2 text-sm text-black"
              value={vagas}
              onChange={(e) => setVagas(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">Salário</label>
            <input
              type="number"
              className="w-full border rounded p-2 text-sm text-black"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Selecionar concurso */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Concurso</label>
          <select
            className="w-full border rounded p-2 text-sm text-black"
            value={concursoId}
            onChange={(e) => setConcursoId(e.target.value)}
            required
          >
            <option value="">Selecione um concurso</option>
            {concursos.map((c) => (
              <option key={c._id} value={c._id}>
                {c.titulo}
              </option>
            ))}
          </select>
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="bg-[#0b2c55] text-white px-4 py-2 rounded text-sm hover:bg-[#081c38] transition"
          disabled={carregando}
        >
          {carregando ? "Salvando..." : "Criar Cargo"}
        </button>
      </form>
    </div>
  );
}
