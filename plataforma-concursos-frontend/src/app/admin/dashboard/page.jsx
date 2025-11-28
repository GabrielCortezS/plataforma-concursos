"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/ui/Header"; // ajuste caso seu Header esteja em outro local
import Footer from "../../components/ui/Footer";

export default function AdminDashboard() {
  const router = useRouter();

  /*
  |---------------------------------------------------------
  | 🔐 Proteção de rota — somente ADMIN pode acessar
  |---------------------------------------------------------
  */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    // Se não existir token → volta para login
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      {/* CONTAINER PRINCIPAL */}
      <main className="flex-1 max-w-5xl mx-auto py-10 px-6">

        <h1 className="text-3xl font-bold text-[#0b2c55] mb-6">
          Painel Administrativo
        </h1>

        {/* CARDS DO PAINEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Concursos */}
          <div
            onClick={() => router.push("/admin/concursos")}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">Concursos</h2>
            <p className="text-gray-600 mt-2">Gerenciar concursos cadastrados</p>
          </div>

          {/* Cargos */}
          <div
            onClick={() => router.push("/admin/cargos")}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">Cargos</h2>
            <p className="text-gray-600 mt-2">Gerenciar cargos dos concursos</p>
          </div>

          {/* Inscrições */}
          <div
            onClick={() => router.push("/admin/inscricoes")}
            className="cursor-pointer bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">Inscrições</h2>
            <p className="text-gray-600 mt-2">Visualizar inscrições realizadas</p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
