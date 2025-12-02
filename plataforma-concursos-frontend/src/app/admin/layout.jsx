"use client";

import { AdminMenu, AdminHeader } from "./components";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();

  /*
  |------------------------------------------------------------
  | Proteção de rotas admin:
  | Se não houver token → redireciona para login
  |------------------------------------------------------------
  */
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Menu lateral fixo */}
      <AdminMenu />

      {/* Conteúdo da direita */}
      <div className="flex-1 flex flex-col">

        <AdminHeader />

        {/* 
        ------------------------------------------------------------
        Ajuste importante:
        - Define altura: 100vh - altura do header (64px)
        - Corrige conteúdo escondido
        - Now o botão "+ Novo Concurso" aparece DIREITINHO
        ------------------------------------------------------------
        */}
        <main className="overflow-y-auto p-8 h-[calc(100vh-64px)] bg-gray-100">
          {children}
        </main>

      </div>
    </div>
  );
}
