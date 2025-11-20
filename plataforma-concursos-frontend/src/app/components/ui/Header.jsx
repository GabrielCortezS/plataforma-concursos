// src/app/components/ui/Header.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { colors } from "@/app/styles/tokens";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="w-full shadow-md bg-white sticky top-0 z-50"
      style={{ borderBottom: `3px solid ${colors.primary}` }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* 🔹 LOGO - volta para a Home */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/inepas-logo.svg"
            alt="INEPAS Logo"
            width={250}
            height={150}
            className="object-contain cursor-pointer"
          />
        </Link>

        {/* 🔹 MENU DESKTOP */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <Link href="/concursos" className="hover:text-blue-900 transition">
            Concursos
          </Link>
          <Link href="/editais" className="hover:text-blue-900 transition">
            Editais
          </Link>
          <Link href="/candidato" className="hover:text-blue-900 transition">
            Área do Candidato
          </Link>
          <Link href="/contato" className="hover:text-blue-900 transition">
            Contato
          </Link>
        </nav>

        {/* 🔹 MENU MOBILE */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* 🔹 MOBILE MENU */}
      {open && (
        <nav className="md:hidden bg-white px-6 py-4 flex flex-col gap-4 shadow-md">
          <Link href="/concursos" className="text-gray-700 hover:text-blue-900">
            Concursos
          </Link>
          <Link href="/editais" className="text-gray-700 hover:text-blue-900">
            Editais
          </Link>
          <Link href="/candidato" className="text-gray-700 hover:text-blue-900">
            Área do Candidato
          </Link>
          <Link href="/contato" className="text-gray-700 hover:text-blue-900">
            Contato
          </Link>
        </nav>
      )}
    </header>
  );
}
