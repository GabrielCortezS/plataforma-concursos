"use client";

/*
|------------------------------------------------------------
| 🟦 Página: /admin/cargos/[id]/editar
|------------------------------------------------------------
| Permite editar um cargo existente.
| Carrega os concursos + dados do cargo + salva via PUT.
|------------------------------------------------------------
*/

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditarCargoPage() {
  const { id } = useParams();
  const router = useRouter();

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [vagas, setVagas] = useState("");
  const [salario, setSalario] = useState("");
  const [nivel, setNivel] = useState("");
  const [concursoId, setConcursoId] = useState("");

  // Dados auxiliares
  const [concursos, setConcursos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  /*
  |------------------------------------------------------------
  | 🔍 Buscar dados do cargo
  |------------------------------------------------------------
  */
  const fetchCargo = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`http://localhost:5000/api/cargos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.mensagem || "Erro ao carregar cargo.");
        return;
      }

      // Preenche campos
      const c = data.cargo;
      setNome(c.nome || "");
      setRequisitos(c.requisitos || "");
      setVagas(c.vagas || "");
      setSalario(c.salario || "");
      setNivel(c.nivel || "");
      setConcursoId(c.concursoId?._id || c.concursoId || "");

    } catch (e) {
      console.error("ERRO AO BUSCAR CARGO:", e);
      setErro("Erro ao conectar ao servidor.");
    }
  };

  /*
  |------------------------------------------------------------
  | 🔍 Buscar concursos para o dropdown
  |------------------------------------------------------------
  */
  const fetchConcursos = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch("http://localhost:5000/api/concursos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        setErro(data.mensagem || "Erro ao carregar concursos.");
        return;
      }

      setConcursos(data);

    } catch (e) {
      console.error("ERRO AO BUSCAR CONCURSOS:", e);
      setErro("Erro ao conectar ao servidor.");
    }
  };

  /*
  |------------------------------------------------------------
  | 🚀 Carregar dados iniciais
  |------------------------------------------------------------
  */
  useEffect(() => {
    if (!id) return;

    const carregar = async () => {
      try {
        await Promise.all([
          fetchCargo(),
          fetchConcursos(),
        ]);

        setErro(""); 
        setCarregando(false);

      } catch (e) {
        console.error("ERRO NO useEffect:", e);
        if (e?.message?.includes("Failed")) {
          setErro("Erro ao conectar ao servidor.");
        }
      }
    };

    carregar();
  }, [id]); // eslint não reclama mais

  /*
  |------------------------------------------------------------
  | 📝 Enviar atualização via PUT
  |------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const token = localStorage.getItem("adminToken");

      const res = await fetch(`http://localhost:5000/api/cargos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          requisitos,
          vagas,
          salario,
          nivel,
          concursoId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCarregando(false);
        return setErro(data.mensagem || "Erro ao atualizar cargo.");
      }

      router.push("/admin/cargos");

    } catch (error) {
      console.error("ERRO AO ATUALIZAR:", error);
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  /*
  |------------------------------------------------------------
  | 🧩 Layout da página
  |------------------------------------------------------------
  */
  return (
    <div className="p-6">

      <h1 className="text-lg font-semibold text-gray-800 mb-6">Editar Cargo</h1>

      {erro && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded mb-4 text-sm">
          {erro}
        </div>
      )}

      {!carregando && (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 space-y-5 max-w-2xl"
        >
          {/* Nome */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Nome do Cargo</label>
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
            <label className="block text-gray-700 text-sm mb-1">Requisitos</label>
            <textarea
              className="w-full border rounded p-2 text-sm text-black h-24"
              value={requisitos}
              onChange={(e) => setRequisitos(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Vagas + Salário + Nível */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <label className="block text-gray-700 text-sm mb-1">Nível</label>
              <select
                className="w-full border rounded p-2 text-sm text-black"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="fundamental">Fundamental</option>
                <option value="médio">Médio</option>
                <option value="superior">Superior</option>
              </select>
            </div>
          </div>

          {/* Concurso */}
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
            {carregando ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      )}
    </div>
  );
}
