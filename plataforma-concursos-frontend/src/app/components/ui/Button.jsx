// src/app/components/ui/Button.jsx
// 🔹 Botão reutilizável

export function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`
        px-4 py-2 font-medium rounded-md 
        bg-[#0b2c55] text-white hover:bg-[#11467f] 
        transition duration-200
        ${className}
      `}
    >
      {/* 🔸 Conteúdo do botão */}
      {children}
    </button>
  );
}
