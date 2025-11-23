// src/app/editais/page.jsx
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import Card from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function EditaisPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold text-[#0b2c55] mb-8">
          Editais Disponíveis
        </h1>

        <p className="text-gray-600 mb-6">
          Aqui você encontra todos os editais disponíveis para download de forma rápida e organizada.
        </p>

        {/* LISTAGEM DE EDITAIS (EXEMPLO) */}
        <div className="grid gap-6">
          <Card>
            <h2 className="text-xl font-semibold text-black">Concurso Prefeitura Monteiro</h2>
            <p className="text-sm text-black mt-2">Edital publicado em 10/01/2025</p>

            <Button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
              Baixar Edital
            </Button>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-black">Concurso Guarda Municipal</h2>
            <p className="text-sm text-black mt-2">Edital publicado em 05/01/2025</p>

            <Button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">
              Baixar Edital
            </Button>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
