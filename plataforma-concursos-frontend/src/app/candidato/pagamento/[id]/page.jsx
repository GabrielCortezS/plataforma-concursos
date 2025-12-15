"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "../../../components/ui/Header";
import Footer from "../../../components/ui/Footer";

/*
|--------------------------------------------------------------------------
| 💳 Tela de Pagamento — PLANO B (Simulado)
| Corrigido:
|   ✓ status exibido corretamente
|   ✓ botão só aparece quando não estiver pago
|---------------------------------------------------------------------------
*/

export default function PagamentoPage() {
  const router = useRouter();
  const { id: inscricaoId } = useParams();

  const [inscricao, setInscricao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [gerando, setGerando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  // 🔐 Verifica login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/candidato/login");
    }
  }, [router]);

  // 🔄 Carrega inscrição
  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/inscricoes/minha/${inscricaoId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const dados = await res.json();

        if (!res.ok) throw new Error(dados.mensagem);

        setInscricao(dados);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }
    if (inscricaoId) carregar();
  }, [inscricaoId]);

  // 🧪 Gerar pagamento simulado
  const gerarPagamento = async () => {
    try {
      setErro("");
      setGerando(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/pagamentos/gerar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inscricaoId }),
      });

      const dados = await res.json();

      if (!res.ok) throw new Error(dados.erro);

      // Atualiza localmente
      setInscricao((prev) => ({
        ...prev,
        paymentStatus: "pago",
      }));

      setMensagemSucesso("Pagamento registrado com sucesso (simulado).");

      setTimeout(() => router.push("/candidato/pagamento/sucesso"), 900);
    } catch (e) {
      setErro(e.message);
    } finally {
      setGerando(false);
    }
  };

  if (carregando)
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">Carregando...</main>
        <Footer />
      </div>
    );

  if (!inscricao)
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center text-red-600">
          {erro || "Inscrição não encontrada."}
        </main>
        <Footer />
      </div>
    );

  // 💡 CORREÇÃO: agora o status vem corretamente
  const statusAtual = inscricao.paymentStatus ?? "não informado";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-xl mx-auto px-6 py-10 text-black">
        <h1 className="text-3xl font-bold mb-4 text-[#0b2c55]">
          Pagamento da Inscrição
        </h1>

        <p><strong>Concurso:</strong> {inscricao.concursoId?.titulo}</p>
        <p className="mt-1"><strong>Cargo:</strong> {inscricao.cargoId?.nome}</p>

        <p className="mt-2">
          <strong>Status do pagamento:</strong>{" "}
          <span className="font-semibold capitalize">{statusAtual}</span>
        </p>

        {erro && (
          <p className="mt-3 text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {erro}
          </p>
        )}

        {mensagemSucesso && (
          <p className="mt-3 text-green-700 bg-green-50 border border-green-200 rounded p-2">
            {mensagemSucesso}
          </p>
        )}

        <div className="mt-6">
          {/* 🔥 CORREÇÃO: só aparece se NÃO for pago */}
          {statusAtual !== "pago" ? (
            <button
              onClick={gerarPagamento}
              disabled={gerando}
              className="w-full bg-[#0b2c55] text-white py-3 rounded hover:bg-[#081c38] transition"
            >
              {gerando ? "Registrando pagamento..." : "Gerar Pagamento (Simulado)"}
            </button>
          ) : (
            <p className="text-green-700 bg-green-50 border border-green-200 rounded p-2 text-center">
              ✔ Esta inscrição já está paga.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
