//- Define onde os arquivos serão salvos
//| - Gera um nome único para cada imagem
//| - Salva na pasta "uploads/"


import multer from "multer";
import path from "path";

// Configuração do armazenamento no disco
const storage = multer.diskStorage({
    // Pasta onde os arquivos serão armazenados
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },

    // Renomeia o arquivo para evitar duplicação
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

// Exporta o middleware configurado
export const upload = multer({ storage });