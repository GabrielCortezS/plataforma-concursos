import multer from "multer";
import path from "path";
import fs from "fs";

// ⚙️ Configuração do armazenamento (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 📁 Pasta onde os documentos serão armazenados
    const dir = "uploads/documentos";

    // 🔹 Cria a pasta automaticamente se não existir
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },

  filename: (req, file, cb) => {
    // 🔹 Gera nome único para evitar conflito de arquivos
    const nomeArquivo = Date.now() + "-" + file.originalname;
    cb(null, nomeArquivo);
  }
});

// 🔍 Filtro de tipos permitidos (PDF e imagens)
function fileFilter(req, file, cb) {
  const tiposPermitidos = [
    "application/pdf",
    "image/png",
    "image/jpg",
    "image/jpeg"
  ];

  // Aceita apenas tipos permitidos
  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo não permitido"), false);
  }
}

// 🚀 Exporta o middleware configurado
export const uploadDocumentos = multer({
  storage,
  fileFilter
});
