"use client";

/*
|------------------------------------------------------------
| 🟦 Tela de Login do Administrador
|------------------------------------------------------------
| Responsável por:
| - Enviar e-mail e senha ao backend
| - Receber token JWT + email + nome
| - Salvar dados no localStorage
| - Redirecionar para o painel admin
|------------------------------------------------------------
*/

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  /*
  |------------------------------------------------------------
  | 🔐 Função de login do administrador
  |------------------------------------------------------------
  */
  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      /*
      |------------------------------------------------------------
      | 📌 IMPORTANTE:
      | A rota correta do backend é:
      |   POST http://localhost:5000/api/auth/login
      |
      | Esta rota agora retorna:
      | {
      |   mensagem,
      |   token,
      |   email,
      |   nome
      | }
      |------------------------------------------------------------
      */
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      /*
      |------------------------------------------------------------
      | ❌ ERRO DE LOGIN
      |------------------------------------------------------------
      */
      if (!response.ok) {
        setCarregando(false);
        return setErro(data.mensagem || "Credenciais inválidas.");
      }

      /*
      |------------------------------------------------------------
      | 🔑 SALVAR TOKEN DO ADMIN
      |------------------------------------------------------------
      */
      localStorage.setItem("adminToken", data.token);

      /*
      |------------------------------------------------------------
      | 💾 SALVAR EMAIL E NOME DO ADMIN
      | Necessário para exibir no AdminHeader
      |------------------------------------------------------------
      */
      if (data.email) {
        localStorage.setItem("adminEmail", data.email);
      }

      if (data.nome) {
        localStorage.setItem("adminNome", data.nome);
      }

      /*
      |------------------------------------------------------------
      | 🔁 REDIRECIONAR PARA O DASHBOARD
      |------------------------------------------------------------
      */
      router.push("/admin/dashboard");

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

  /*
  |------------------------------------------------------------
  | 🎨 Layout da tela de login
  |------------------------------------------------------------
  */
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">

        <h1 className="text-black text-xl font-bold text-center mb-6">
          Login do Administrador
        </h1>

        {erro && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          {/* CAMPO DE EMAIL */}
          <div>
            <label className="text-black block mb-1">E-mail</label>
            <input
              type="email"
              className="text-black w-full border px-3 py-2 rounded"
              value={email}
              placeholder="admin@inepas.org"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* CAMPO DE SENHA */}
          <div>
            <label className="text-black block mb-1">Senha</label>
            <input
              type="password"
              className="text-black w-full border px-3 py-2 rounded"
              value={senha}
              placeholder="Digite sua senha"
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {/* BOTÃO */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#0b2c55] text-white py-2 rounded hover:bg-[#081c38] disabled:opacity-50"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

        </form>
      </div>
    </div>
  );
}
