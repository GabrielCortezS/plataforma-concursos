"use client";

import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AreaDoCandidato() {
  const router = useRouter();

  /*
  |---------------------------------------------------------
  | 🔐 Validação de login
  | - Se não tiver token, redireciona para /candidato/login
  |---------------------------------------------------------
  */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/candidato/login?redirect=/candidato");
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">

      <Header />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 text-black">

        <h1 className="text-3xl font-bold mb-4">Área do Candidato</h1>
        <p className="text-gray-700 mb-8">
          Bem-vindo(a)! Aqui você pode acompanhar suas inscrições, atualizar seus dados
          e acessar concursos disponíveis.
        </p>

        {/* CARDS / OPÇÕES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 🔹 Ver Concursos */}
          <Link
            href="/concursos"
            className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">Concursos Disponíveis</h2>
            <p>Veja todos os concursos ativos e faça sua inscrição.</p>
          </Link>

          {/* 🔹 Minhas Inscrições (iremos fazer depois) */}
          <Link
            href="/candidato/inscricoes"
            className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">Minhas Inscrições</h2>
            <p>Acompanhe o status das inscrições realizadas.</p>
          </Link>

          {/* 🔹 Atualizar Dados (iremos fazer mais pra frente) */}
          <Link
            href="/candidato/meus-dados"
            className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">Meus Dados</h2>
            <p>Atualize seus dados pessoais quando desejar.</p>
          </Link>

        </div>
      </main>

      <Footer />

    </div>
  );
}
