// src/app/components/ui/Badge.jsx
// 🔹 Componente Badge responsivo e amigável ao Design System

import { colors } from "@/app/styles/tokens";

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  // 🎨 Variantes corrigidas e com boa visibilidade em qualquer tela
  const variants = {
    default: `bg-[${colors.primary}] text-white`,          // Azul principal
    success: "bg-green-600 text-white",
    warning: "bg-yellow-400 text-black",
    error: "bg-red-600 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <span
      className={`
        inline-block 
        text-xs 
        md:text-sm 
        font-semibold 
        px-3 py-1 
        rounded-full 
        whitespace-nowrap 
        ${variants[variant]} 
        ${className}
      `}
    >
      {children}
    </span>
  );
}
