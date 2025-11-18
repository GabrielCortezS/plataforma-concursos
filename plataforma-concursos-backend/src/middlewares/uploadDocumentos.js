import multer from "multer";
import path from "path";

// Configuração do armazenamento

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //Criar a pasta de uploads se não existir
        cb(null, "uploads/documentos/");
    },

    filename: (req, file, cb) => {
        //Nome unico evitar conflitos
        const nomeArquivo = Date.now() + "-" + file.originalname;
        cb(null, nomeArquivo);
    }

});

// Filtro de tipos permitidos
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

export const uploadDocumentos = multer({
  storage,
  fileFilter
});