// src/app/components/ui/Header.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors } from "@/app/styles/tokens";

export default function Header() {
  const [open, setOpen] = useState(false);

  // 🔹 Estado para saber se o candidato está logado
  const [isLogged, setIsLogged] = useState(false);

  const router = useRouter();

  /*
  |---------------------------------------------------------
  | 🔍 Verifica se existe token no navegador (login ativo)
  |---------------------------------------------------------
  */
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLogged(!!token);
    };

    checkLogin();
  }, []);

  /*
  |---------------------------------------------------------
  | 🔐 Logout — remove token e redireciona
  |---------------------------------------------------------
  */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogged(false);
    router.push("/");
  };

  return (
    <header
      className="w-full shadow-md bg-white sticky top-0 z-50"
      style={{ borderBottom: `3px solid ${colors.primary}` }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* 🔹 LOGO — Home */}
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

          {/* 
          <Link href="/contato" className="hover:text-blue-900 transition">
            Contato
          </Link>
          */}

          {/* 🔹 Link exclusivo para candidatos logados */}
          {isLogged && (
            <Link
              href="/candidato"
              className="hover:text-blue-900 transition font-medium"
            >
              Área do Candidato
            </Link>
          )}

          {/* 🔹 Login / Logout */}
          {isLogged ? (
            <button
              onClick={handleLogout}
              className="hover:text-red-600 transition font-medium"
            >
              Sair
            </button>
          ) : (
            <Link
              href="/candidato/login"
              className="hover:text-blue-900 transition font-medium"
            >
              Login
            </Link>
          )}
        </nav>

        {/* 🔹 HAMBURGUER MOBILE */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? "✖" : "☰"}
        </button>
      </div>

      {/* 🔹 MENU MOBILE */}
      {open && (
        <nav className="md:hidden bg-white px-6 py-4 flex flex-col gap-4 shadow-md">

          <Link href="/concursos" className="text-gray-700 hover:text-blue-900">
            Concursos
          </Link>

          <Link href="/editais" className="text-gray-700 hover:text-blue-900">
            Editais
          </Link>

          {/*
          <Link href="/contato" className="text-gray-700 hover:text-blue-900">
            Contato
          </Link>
         */}

          {/* 🔹 Área do Candidato — somente logado */}
          {isLogged && (
            <Link
              href="/candidato"
              className="text-gray-700 hover:text-blue-900"
              onClick={() => setOpen(false)}
            >
              Área do Candidato
            </Link>
          )}

          {/* 🔹 Login / Logout (mobile) */}
          {isLogged ? (
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="text-red-600 font-medium"
            >
              Sair
            </button>
          ) : (
            <Link
              href="/candidato/login"
              onClick={() => setOpen(false)}
              className="text-gray-700 hover:text-blue-900"
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
