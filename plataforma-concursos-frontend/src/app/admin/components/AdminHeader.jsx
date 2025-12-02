"use client";

/*
|------------------------------------------------------------
| 🔹 AdminHeader
| Barra superior do painel administrativo
| Exibe o nome do administrador logado
|------------------------------------------------------------
| ⛔ Importante:
| React 18 (Strict Mode) executa useEffect duas vezes em DEV,
| o que causa warnings quando usamos setState dentro do effect.
|
| Para resolver isso:
| 1. Verificamos se o estado realmente precisa ser atualizado
| 2. Usamos setTimeout(...,0) para evitar atualização síncrona
|------------------------------------------------------------
*/

import { useEffect, useState } from "react";

export default function AdminHeader() {
  // Armazena o email do admin (pode ser null inicialmente)
  const [adminEmail, setAdminEmail] = useState(null);

  useEffect(() => {
    // Recupera o email salvo no login
    const email = localStorage.getItem("adminEmail");

    // Só atualiza se o email existir e for diferente do estado atual
    if (email && adminEmail !== email) {
      // Resolve warning do React (atualização assíncrona)
      setTimeout(() => {
        setAdminEmail(email);
      }, 0);
    }
  }, []); // Executa apenas uma vez

  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">
        Painel Administrativo
      </h2>

      <span className="text-gray-600">
        👤 {adminEmail ?? "Administrador"}
      </span>
    </header>
  );
}
