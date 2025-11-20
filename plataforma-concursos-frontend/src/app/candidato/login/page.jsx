"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { Button } from "../../components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  /*
  |---------------------------------------------------------
  | 🔐 Função de Login
  | - Envia email e senha para o backend
  | - Armazena token
  | - Redireciona corretamente
  |---------------------------------------------------------
  */
  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/candidato/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.mensagem || "Erro ao fazer login");
        return;
      }

      // 🔹 Salva token no navegador
      localStorage.setItem("token", data.token);

      // 🔹 Verifica se existe rota de retorno (redirect)
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");

      // 🔹 Se existir redirect → volta exatamente para a tela anterior
      if (redirect) {
        window.location.href = redirect;
        return;
      }

      // 🔹 Caso contrário → vai para o dashboard
      window.location.href = "/candidato/dashboard";

    } catch (err) {
      setErro("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* CONTEÚDO */}
      <main className="flex-1 max-w-md mx-auto px-6 py-14">

        <h1 className="text-3xl font-bold text-black text-center mb-8">
          Área do Candidato
        </h1>

        {/* FORMULÁRIO */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="block mb-1 text-black font-medium">E-mail</label>
            <input
              type="email"
              className="w-full border px-4 py-2 rounded-md text-black"
              placeholder="seuemail@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* SENHA */}
          <div>
            <label className="block mb-1 text-black font-medium">Senha</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded-md text-black"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {/* ERROS */}
          {erro && <p className="text-red-600 text-sm">{erro}</p>}

          {/* BOTÃO */}
          <Button className="w-full bg-[#0b2c55] text-white py-3 rounded-md">
            Entrar
          </Button>
        </form>

        {/* Link para criação de conta */}
        <p className="text-center mt-6 text-black">
          Ainda não tem conta?{" "}
          <Link href="/candidato/registrar" className="text-blue-600 underline">
            Criar conta
          </Link>
        </p>

      </main>

      <Footer />
    </div>
  );
}
