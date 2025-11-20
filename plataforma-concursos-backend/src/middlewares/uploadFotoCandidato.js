import multer from "multer";
import path from "path";
import fs from "fs";

// Criar pasta uploads/candidatos se não existir
const uploadPath = "uploads/candidatos";

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const nomeArquivo = Date.now() + "-" + file.originalname;
        cb(null, nomeArquivo);
    }
});

// Filtro de tipos permitidos
const fileFilter = (req, file, cb) => {
    const tiposPermitidos = [
        "image/png",
        "image/jpg",
        "image/jpeg"
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Formato de imagem não permitido. Envie JPG ou PNG."), false);
    }
};

// Exportar configuração do multer
export const uploadFotoCandidato = multer({
    storage,
    fileFilter
});
