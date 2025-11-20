"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import Card from "./components/ui/Card";
import Badge from "./components/ui/Badge";
import { Button } from "./components/ui/Button";

export default function Home() {
  const [concursos, setConcursos] = useState([]);

  // 👉 Carrega concursos reais do backend
  useEffect(() => {
    async function fetchConcursos() {
      const res = await fetch("http://localhost:5000/api/concursos");
      const data = await res.json();
      setConcursos(data);
    }
    fetchConcursos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">

        {/* 🔵 Banner */}
        <section className="bg-[#0b2c55] text-white py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao INEPAS</h1>
          <p className="text-lg opacity-90">
            Plataforma oficial de concursos públicos, editais e inscrições.
          </p>
        </section>

        {/* 🟦 Título Lista */}
        <section className="max-w-6xl mx-auto px-4 mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-black ">
            Concursos Recentes
          </h2>

          {/* ⬜ GRID DE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {concursos.map((item) => (
              <Card key={item._id} className="h-full flex flex-col justify-between">

                <div>
                  <h3 className="font-semibold text-lg text-black">
                    {item.titulo}
                  </h3>

                  <p className="text-black">
                    {item.descricao?.slice(0, 80)}...
                  </p>
                </div>

                <div className="mt-4">
                  {item.status === "aberto" && (
                    <Badge variant="success">Inscrições Abertas</Badge>
                  )}
                  {item.status === "breve" && (
                    <Badge variant="warning">Em Breve</Badge>
                  )}
                  {item.status === "encerrado" && (
                    <Badge variant="error">Encerrado</Badge>
                  )}

                  {/* 🔗 Botão com redirecionamento */}
                  <Link href={`/concursos/${item._id}`}>
                    <Button className="w-full mt-4">Ver Detalhes</Button>
                  </Link>
                </div>

              </Card>
            ))}

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
