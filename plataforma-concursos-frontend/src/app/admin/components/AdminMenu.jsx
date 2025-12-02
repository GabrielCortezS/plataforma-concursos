"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  function logout() {
    localStorage.removeItem("adminToken");
    router.replace("/admin/login");
  }

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-[#0b2c55] text-white h-full transition-all duration-300 flex flex-col`}
    >
      {/* Logo + botão */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        <h1 className={`font-bold text-xl ${!open && "hidden"}`}>
          INEPAS Admin
        </h1>

        <button
          className="text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? "◀" : "▶"}
        </button>
      </div>

      {/* LINKS */}
      <nav className="flex-1 p-4 space-y-2">

        <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-white hover:text-[#0b2c55] transition">
          📊 {open && "Dashboard"}
        </Link>

        <Link href="/admin/concursos" className="block px-3 py-2 rounded hover:bg-white hover:text-[#0b2c55] transition">
          📝 {open && "Concursos"}
        </Link>

        <Link href="/admin/cargos" className="block px-3 py-2 rounded hover:bg-white hover:text-[#0b2c55] transition">
          💼 {open && "Cargos"}
        </Link>

        <Link href="/admin/inscricoes" className="block px-3 py-2 rounded hover:bg-white hover:text-[#0b2c55] transition">
          📑 {open && "Inscrições"}
        </Link>
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className="m-4 py-2 rounded bg-red-600 hover:bg-red-700 transition"
      >
        🚪 {open && "Sair"}
      </button>
    </aside>
  );
}
