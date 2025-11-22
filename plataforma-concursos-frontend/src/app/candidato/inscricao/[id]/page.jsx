// src/app/candidato/inscricao/[id]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";

/*
|---------------------------------------------------------
| 📄 Tela de Inscrição do Candidato
| - Rota: /candidato/inscricao/[id]
| - [id] = ID do concurso
|---------------------------------------------------------
*/

export default function InscricaoPage() {
  const router = useRouter();
  const params = useParams();
  const concursoId = params?.id;

  // 🔹 Estados para dados do concurso e cargos
  const [concurso, setConcurso] = useState(null);
  const [cargos, setCargos] = useState([]);

  // 🔹 Estados do formulário
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [rg, setRg] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [cep, setCep] = useState("");
  const [cargoId, setCargoId] = useState("");

  // 🔹 Foto 3x4
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  // 🔹 Concordância
  const [concordaTermos, setConcordaTermos] = useState(false);

  // 🔹 Estados de feedback
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  /*
  |---------------------------------------------------------
  | 🔐 Proteção da rota (exige login)
  |---------------------------------------------------------
  */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Guarda a página atual para redirecionar após login
      localStorage.setItem("redirectTo", `/candidato/inscricao/${concursoId}`);
      router.push("/candidato/login");
    }
  }, [router, concursoId]);

  /*
  |---------------------------------------------------------
  | 🔄 Buscar concurso + cargos relacionados
  |---------------------------------------------------------
  */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !concursoId) return;

    async function carregarDados() {
      try {
        setCarregando(true);

        // 🔵 Buscar concurso
        const resConcurso = await fetch(
          `http://localhost:5000/api/concursos/${concursoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const dadosConcurso = await resConcurso.json();
        if (!resConcurso.ok) {
          throw new Error(
            dadosConcurso.mensagem || "Erro ao carregar concurso"
          );
        }
        setConcurso(dadosConcurso);

        // 🔵 Buscar cargos filtrados do concurso
        const resCargos = await fetch(
          `http://localhost:5000/api/cargos/concurso/${concursoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const dataCargos = await resCargos.json();
        if (!resCargos.ok) {
          throw new Error(
            dataCargos.mensagem || "Erro ao carregar cargos do concurso"
          );
        }

        setCargos(dataCargos.cargos || []);
      } catch (error) {
        setErro(error.message || "Erro ao carregar dados.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [concursoId]);

  /*
  |---------------------------------------------------------
  | 📷 Foto 3x4: PREVIEW
  |---------------------------------------------------------
  */
  const handleFotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  /*
  |---------------------------------------------------------
  | 💾 ENVIAR INSCRIÇÃO
  |---------------------------------------------------------
  */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro("");
    setSucesso("");

    // 🔎 Validações básicas
    if (!cargoId) return setErro("Selecione um cargo.");
    if (!concordaTermos) return setErro("Você deve concordar com os termos.");
    if (!fotoFile) return setErro("Envie uma foto 3x4.");

    try {
      setSalvando(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();

      // Dados enviados ao backend
      formData.append("concursoId", concursoId);
      formData.append("cargoId", cargoId);
      formData.append("nomeCompleto", nomeCompleto);
      formData.append("cpf", cpf);
      formData.append("rg", rg);
      formData.append("dataNascimento", dataNascimento);
      formData.append("email", email);
      formData.append("telefone", telefone);
      formData.append("endereco", endereco);
      formData.append("cidade", cidade);
      formData.append("uf", uf);
      formData.append("cep", cep);
      formData.append("concordaTermos", concordaTermos ? "true" : "false");
      formData.append("foto", fotoFile);

      const response = await fetch("http://localhost:5000/api/inscricoes", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || "Erro ao realizar inscrição.");
      }

      // ✔ Exibe mensagem rápida
      setSucesso("Inscrição realizada com sucesso!");

      /*
      |---------------------------------------------------------
      | 🔥 SALVA O COMPROVANTE PARA A TELA DE SUCESSO
      |---------------------------------------------------------
      */
      if (data.comprovanteUrl) {
        localStorage.setItem("comprovantePdf", data.comprovanteUrl);
      }

      // ⏳ Redireciona após 800ms
      setTimeout(() => {
        router.push("/candidato/inscricao/sucesso");
      }, 800);
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  /*
  |---------------------------------------------------------
  | 🔄 Tela de carregamento
  |---------------------------------------------------------
  */
  if (carregando && !concurso) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          Carregando dados da inscrição...
        </main>
        <Footer />
      </div>
    );
  }

  /*
  |---------------------------------------------------------
  | RENDERIZAÇÃO PRINCIPAL
  |---------------------------------------------------------
  */
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 text-black">
        <h1 className="text-3xl font-bold mb-2">Inscrição no Concurso</h1>

        {concurso && (
          <div className="mb-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold">{concurso.titulo}</h2>
            <p className="text-gray-700 mt-1">Órgão: {concurso.orgao}</p>
          </div>
        )}

        {/* Mensagens */}
        {erro && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">
            {sucesso}
          </div>
        )}

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- DADOS PESSOAIS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label>Nome completo</label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded-md"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                required
              />
            </div>

            <div>
              <label>CPF</label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded-md"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              />
            </div>

            <div>
              <label>RG</label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded-md"
                value={rg}
                onChange={(e) => setRg(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Data de nascimento</label>
              <input
                type="date"
                className="w-full border px-4 py-2 rounded-md"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>

            <div>
              <label>E-mail</label>
              <input
                type="email"
                className="w-full border px-4 py-2 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Telefone</label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded-md"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>
          </div>

          {/* --- ENDEREÇO --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label>Endereço</label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded-md"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </div>

            <div>
              <label>Cidade</label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded-md"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>

            <div>
              <label>UF</label>
              <input
                type="text"
                maxLength={2}
                className="w-full border px-4 py-2 rounded-md uppercase"
                value={uf}
                onChange={(e) => setUf(e.target.value.toUpperCase())}
              />
            </div>

            <div>
              <label>CEP</label>
              <input
                type="text"
                className="w-full border px-4 py-2 rounded-md"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
            </div>
          </div>

          {/* --- CARGO + FOTO --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* SELECT DE CARGOS */}
            <div className="md:col-span-2">
              <label>Cargo pretendido</label>
              <select
                className="w-full border px-4 py-2 rounded-md bg-white"
                value={cargoId}
                onChange={(e) => setCargoId(e.target.value)}
                required
              >
                <option value="">Selecione um cargo</option>

                {cargos.map((cargo) => (
                  <option key={cargo._id} value={cargo._id}>
                    {cargo.nome} {cargo.salario && `- R$ ${cargo.salario}`}
                  </option>
                ))}
              </select>
            </div>

            {/* FOTO 3x4 */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Foto 3x4
              </label>

              <label className="flex items-center justify-center w-full px-4 py-3 bg-[#0b2c55] text-white rounded-md cursor-pointer hover:bg-[#081c38] transition font-medium shadow-md">
                Selecionar foto 3x4
                <input
                  type="file"
                  name="foto"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="hidden"
                  required
                />
              </label>

              {fotoFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Arquivo selecionado:{" "}
                  <span className="font-medium">{fotoFile.name}</span>
                </p>
              )}

              {fotoPreview && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Pré-visualização:</p>
                  <img
                    src={fotoPreview}
                    alt="Foto 3x4"
                    className="w-24 h-32 object-cover rounded-md border shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>

          {/* --- TERMOS --- */}
          <div className="mt-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={concordaTermos}
                onChange={(e) => setConcordaTermos(e.target.checked)}
                required
              />
              <span className="text-gray-800">
                Declaro que li e concordo com o edital e os termos.
              </span>
            </label>
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={salvando}
            className="bg-[#0b2c55] text-white px-6 py-3 rounded-md hover:bg-[#081c38] transition disabled:opacity-60"
          >
            {salvando ? "Enviando..." : "Concluir inscrição"}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
