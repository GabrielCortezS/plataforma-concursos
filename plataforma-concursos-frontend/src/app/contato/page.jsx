"use client";

import { useState } from "react";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import { Button } from "../components/ui/Button";

/*
|--------------------------------------------------------------------------
| 📌 Tela de Contato — INEPAS
| - Formulário simples com nome, email e mensagem
| - Com layout limpo e responsivo
| - Pode futuramente integrar API de envio de e-mail
|--------------------------------------------------------------------------
*/

export default function ContatoPage() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  const [statusMsg, setStatusMsg] = useState(null);

  /*
  |------------------------------------------------------------
  | Atualiza campos do formulário
  |------------------------------------------------------------
  */
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /*
  |------------------------------------------------------------
  | Enviar formulário (versão mock por enquanto)
  |------------------------------------------------------------
  */
  function handleSubmit(e) {
    e.preventDefault();

    // Apenas mostrar mensagem de simulação por enquanto
    setStatusMsg("Mensagem enviada com sucesso! Em breve retornaremos.");
    setForm({ nome: "", email: "", mensagem: "" });
  }

  return (
    <div className="flex flex-col min-h-screen text-black">
      <Header />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Entre em Contato</h1>

        <p className="text-gray-700 text-center mb-8">
          Tem alguma dúvida sobre concursos, inscrições ou editais?  
          Preencha o formulário abaixo e nossa equipe entrará em contato.
        </p>

        {/* STATUS (MENSAGEM DE SUCESSO) */}
        {statusMsg && (
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded mb-6 text-center">
            {statusMsg}
          </div>
        )}

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NOME */}
          <div>
            <label className="block font-medium mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Seu nome completo"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block font-medium mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="seuemail@exemplo.com"
            />
          </div>

          {/* MENSAGEM */}
          <div>
            <label className="block font-medium mb-1">Mensagem</label>
            <textarea
              name="mensagem"
              value={form.mensagem}
              onChange={handleChange}
              required
              rows="5"
              className="w-full border rounded px-3 py-2"
              placeholder="Escreva aqui sua dúvida..."
            ></textarea>
          </div>

          {/* BOTÃO ENVIAR */}
          <Button
            type="submit"
            className="w-full bg-[#0b2c55] text-white py-3"
          >
            Enviar Mensagem
          </Button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
