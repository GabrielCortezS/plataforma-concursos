/*
|------------------------------------------------------------
| 📁 UPLOAD DE DOCUMENTOS DO CONCURSO (PDF + IMAGENS)
|------------------------------------------------------------
| - Aceita:
|     🔹 "edital"  → PDF (1 arquivo)
|     🔹 "imagens" → imagens (até 10 arquivos)
|
| - Cria pasta automaticamente
| - Filtra tipos permitidos
| - Gera nomes únicos
|
| Este middleware evita o erro:
| MulterError: Unexpected field
|------------------------------------------------------------
*/

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
    const ext = path.extname(file.originalname);
    const nomeArquivo = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

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

  if (tiposPermitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de arquivo não permitido"), false);
  }
}

/*
|------------------------------------------------------------
| 🚀 Configuração final do Multer
|------------------------------------------------------------
| ⚠️ Agora o Multer SABE que deve aceitar:
| - "edital" (1 arquivo)
| - "imagens" (vários arquivos)
|------------------------------------------------------------
*/
export const uploadDocumentos = multer({
  storage,
  fileFilter
}).fields([
  { name: "edital", maxCount: 1 },     // 📄 PDF obrigatório
  { name: "imagens", maxCount: 10 }    // 🖼 imagens opcionais
]);
