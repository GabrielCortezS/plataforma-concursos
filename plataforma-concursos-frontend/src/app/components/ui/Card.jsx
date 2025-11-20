// src/app/components/ui/Card.jsx
// 🔷 Componente Card reutilizável da plataforma
// Suporta título, subtítulo e conteúdo livre (children)

import { colors } from "@/app/styles/tokens";

export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`w-full bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition ${className}`}
    >
      {/* 🔹 Título principal */}
      {title && (
        <h2 className="text-lg font-semibold text-[var(--color-primary)] mb-1">
          {title}
        </h2>
      )}

      {/* 🔹 Subtítulo (linha menor abaixo do título) */}
      {subtitle && (
        <p className="text-sm text-gray-600 mb-3">
          {subtitle}
        </p>
      )}

      {/* 🔹 Conteúdo interno */}
      <div>{children}</div>
    </div>
  );
}
