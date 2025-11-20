// src/app/components/ui/Input.jsx
// 🔹 Componente de Input reutilizável

import { colors } from "@/app/styles/tokens";

export default function Input({ label, placeholder, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      
      {/* 🔸 Label do campo */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* 🔸 Campo de entrada */}
      <input
        className="
          w-full px-3 py-2 border rounded-md 
          border-gray-300 focus:outline-none 
          focus:ring-2 focus:ring-blue-600
        "
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
