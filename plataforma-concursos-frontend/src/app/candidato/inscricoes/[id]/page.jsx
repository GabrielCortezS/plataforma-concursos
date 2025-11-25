"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";
import { Button } from "../../../components/ui/Button";

/*
|--------------------------------------------------------------------------
| 📌 Função utilitária para formatar datas no padrão BR
|--------------------------------------------------------------------------
*/
function formatarData(data) {
  if (!data) return "—";
  const d = new Date(data);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR");
}

export default function EditarInscricaoPage() {
  const { id } = useParams(); // ID da inscrição
  const router = useRouter();

  const [inscricao, setInscricao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [novaFoto, setNovaFoto] = useState(null);

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    cpf: "",
    email: "",
    telefone: "",
  });

  // Token do candidato
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /*
  |--------------------------------------------------------------------------
  | 🔍 Buscar dados da inscrição do candidato
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    async function fetchInscricao() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/inscricoes/minha/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.inscricao) {
          setInscricao(data.inscricao);

          setFormData({
            nomeCompleto: data.inscricao.nomeCompleto || "",
            cpf: data.inscricao.cpf || "",
            email: data.inscricao.email || "",
            telefone: data.inscricao.telefone || "",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar inscrição:", error);
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchInscricao();
  }, [id, token]);

  /*
  |--------------------------------------------------------------------------
  | 📤 Atualizar inscrição (CANDIDATO)
  |--------------------------------------------------------------------------
  */
  async function handleAtualizar(e) {
    e.preventDefault();

    const body = new FormData();
    body.append("nomeCompleto", formData.nomeCompleto);
    body.append("cpf", formData.cpf);
    body.append("email", formData.email);
    body.append("telefone", formData.telefone);

    if (novaFoto) {
      body.append("foto", novaFoto);
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/inscricoes/minha/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body,
        }
      );

      const data = await res.json();
      alert(data.mensagem || "Atualizado com sucesso!");

      router.push("/candidato/meus-dados");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar inscrição.");
    }
  }

  if (loading)
    return <p className="text-center mt-10">Carregando inscrição...</p>;

  if (!inscricao)
    return (
      <p className="text-center text-red-600 mt-10">
        Inscrição não encontrada.
      </p>
    );

  return (
    <div className="flex flex-col min-h-screen text-black">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Atualizar Dados da Inscrição
        </h1>

        <form
          onSubmit={handleAtualizar}
          className="bg-gray-100 p-6 rounded shadow"
        >
          {/* Nome Completo */}
          <div className="mb-4">
            <label className="font-semibold">Nome Completo</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={formData.nomeCompleto}
              onChange={(e) =>
                setFormData({ ...formData, nomeCompleto: e.target.value })
              }
            />
          </div>

          {/* CPF */}
          <div className="mb-4">
            <label className="font-semibold">CPF</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={formData.cpf}
              onChange={(e) =>
                setFormData({ ...formData, cpf: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="font-semibold">E-mail</label>
            <input
              type="email"
              className="w-full p-2 border rounded mt-1"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          {/* Telefone */}
          <div className="mb-4">
            <label className="font-semibold">Telefone</label>
            <input
              type="text"
              className="w-full p-2 border rounded mt-1"
              value={formData.telefone}
              onChange={(e) =>
                setFormData({ ...formData, telefone: e.target.value })
              }
            />
          </div>

          {/* Foto atual */}
          {inscricao.foto && (
            <div className="mb-4">
              <label className="font-semibold">Foto Atual:</label>
              <img
                src={`http://localhost:5000/${inscricao.foto}`}
                className="w-32 mt-2 rounded shadow"
              />
            </div>
          )}

          {/* Input nova foto */}
          <div className="mb-6">
            <label className="font-semibold">Enviar nova foto (opcional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full mt-2"
              onChange={(e) => setNovaFoto(e.target.files[0])}
            />
          </div>

          <Button type="submit" className="w-full bg-[#0b2c55] text-white py-3">
            Salvar Alterações
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
