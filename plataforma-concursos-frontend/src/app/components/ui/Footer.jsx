// src/app/components/ui/Footer.jsx
// 🔹 Footer institucional responsivo

import { colors } from "@/app/styles/tokens";

export default function Footer() {
  return (
    <footer
      className="w-full text-center py-6 mt-10"
      style={{ backgroundColor: colors.primary, color: "white" }}
    >
      <div className="max-w-6xl mx-auto px-4">

        {/* 🔸 Nome da instituição */}
        <p className="font-semibold text-sm">
          INEPAS — Instituto Nacional de Exames e Processos de Avaliação e Seleção
        </p>

        {/* 🔸 Linha sutil */}
        <div className="w-full h-[1px] bg-white/20 my-3"></div>

        {/* 🔸 Informações extras ou direitos autorais */}
        <p className="text-xs opacity-80">
          © {new Date().getFullYear()} Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
