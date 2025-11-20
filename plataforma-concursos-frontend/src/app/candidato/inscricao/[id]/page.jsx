"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";
import Input from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export default function PaginaInscricao() {
  const { id } = useParams(); // ID do concurso
  const router = useRouter();

  // Dados do concurso
  const [concurso, setConcurso] = useState(null);

  // Dados do formulário de inscrição
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cargoId, setCargoId] = useState("");
  const [foto, setFoto] = useState(null);

  const [erro, setErro] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ================================
  // 🔹 Buscar dados do concurso
  // ================================
  useEffect(() => {
    async function carregar() {
      const res = await fetch(`http://localhost:5000/api/concursos/${id}`);
      const data = await res.json();
      setConcurso(data);
    }
    carregar();
  }, [id]);

  // ================================
  // 🔹 Enviar inscrição
  // ================================
  async function enviarInscricao(e) {
    e.preventDefault();
    setErro("");

    try {
      const formData = new FormData();
      formData.append("nomeCompleto", nome);
      formData.append("cpf", cpf);
      formData.append("email", email);
      formData.append("telefone", telefone);
      formData.append("cargoId", cargoId);
      formData.append("concursoId", id);
      formData.append("concordaTermos", true);
      if (foto) formData.append("foto", foto);

      const response = await fetch("http://localhost:5000/inscricoes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.mensagem);
        return;
      }

      alert("Inscrição realizada com sucesso!");
      router.push("/candidato/dashboard");

    } catch (err) {
      setErro("Erro ao enviar inscrição.");
    }
  }

  return (
    <div className="flex flex-col min-h-screen text-black">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Formulário de Inscrição</h1>

        {!concurso ? (
          <p>Carregando concurso...</p>
        ) : (
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <p><strong>Concurso:</strong> {concurso.titulo}</p>
            <p><strong>Órgão:</strong> {concurso.orgao}</p>
          </div>
        )}

        <form onSubmit={enviarInscricao} className="space-y-4">

          <Input
            label="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <Input
            label="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />

          <Input
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />

          {/* Seleção de cargo */}
          <label className="block font-medium">Cargo</label>
          <select
            className="w-full border px-3 py-2 rounded-md"
            value={cargoId}
            onChange={(e) => setCargoId(e.target.value)}
            required
          >
            <option value="">Selecione um cargo</option>
            {concurso?.cargos?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nome}
              </option>
            ))}
          </select>

          {/* Upload da foto */}
          <div>
            <label className="block font-medium">Foto do candidato</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files[0])}
              required
            />
          </div>

          {erro && <p className="text-red-600">{erro}</p>}

          <Button className="w-full bg-[#0b2c55] text-white py-3">
            Enviar Inscrição
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
