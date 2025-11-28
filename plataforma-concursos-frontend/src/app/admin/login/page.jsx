"use client";

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
      |-----------------------------------------------
      | 📌 REQUISIÇÃO CORRETA PARA O BACKEND
      |-----------------------------------------------
      */
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      // Extrai JSON corretamente
      const data = await response.json();

      if (!response.ok) {
        setCarregando(false);
        return setErro(data.mensagem || "Credenciais inválidas.");
      }

      /*
      |-----------------------------------------------
      | 🔑 SALVAR TOKEN DE ADMIN
      |-----------------------------------------------
      */
      localStorage.setItem("adminToken", data.token);

      /*
      |-----------------------------------------------
      | 🔁 REDIRECIONAR PARA A DASHBOARD
      |-----------------------------------------------
      */
      router.push("/admin/dashboard");

    } catch (error) {
      setErro("Erro ao conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  };

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
          <div>
            <label className="text-black block mb-1">E-mail</label>
            <input
              type="email"
              className="text-black w-full border px-3 py-2 rounded"
              value={email}
              placeholder="admin@email.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-black block mb-1">Senha</label>
            <input
              type="password"
              className="text-black w-full border px-3 py-2 rounded"
              value={senha}
              placeholder="Senha"
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-[#0b2c55] text-white py-2 rounded hover:bg-[#081c38]"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
