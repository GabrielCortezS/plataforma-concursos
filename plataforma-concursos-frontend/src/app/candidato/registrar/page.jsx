"use client";

import { useState } from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { Button } from "../../components/ui/Button";
import Link from "next/link";


export default function RegistrarPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleRegistrar(e) {
    e.preventDefault();

    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/candidato/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, cpf, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.mensagem || "Erro ao registrar");
        return;
      }

      setSucesso("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => {
        window.location.href = "/candidato/login";
      }, 1500);

    } catch (err) {
      setErro("Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-md mx-auto px-6 py-14 ">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">Criar Conta</h1>

        {/* FORMULÁRIO */}
        <form onSubmit={handleRegistrar} className="space-y-4">

          {/* NOME */}
          <div>
            <label className="block mb-1 font-medium text-black">Nome completo</label>
            <input
              type="text "
              className="w-full border px-4 py-2 rounded-md text-black "
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block mb-1 font-medium text-black">E-mail</label>
            <input
              type="email"
              className="w-full border px-4 py-2 rounded-md text-black"
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* CPF */}
          <div>
            <label className="block mb-1 font-medium text-black">CPF</label>
            <input
              type="text"
              className="w-full border px-4 py-2 rounded-md text-black"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>

          {/* SENHA */}
          <div>
            <label className="block mb-1 font-medium text-black ">Senha</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded-md text-black"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {/* CONFIRMAR SENHA */}
          <div>
            <label className="block mb-1 font-medium text-black ">Confirmar Senha</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded-md text-black"
              placeholder="********"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          {/* ERROS */}
          {erro && <p className="text-red-600 text-sm">{erro}</p>}

          {/* SUCESSO */}
          {sucesso && <p className="text-green-600 text-sm">{sucesso}</p>}

          {/* BOTÃO */}
          <Button className="w-full bg-[#0b2c55] text-white py-3 rounded-md">
            Criar Conta
          </Button>
        </form>

        {/* Link para login */}
        <p className="text-center mt-6 text-black">
          Já tem uma conta?
          <Link href="/candidato/login" className="text-blue-600 ml-1">
            Fazer login
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
