import fs from "fs";
import path from "path";

export const deleteFile = (filePath) => {
    try {
        if (!filePath) return;

        // Corrige caminhos em Windows (\ → /)
        const normalized = filePath.replace(/\\/g, "/");

        // Garante que o caminho é absoluto
        const absolutePath = path.resolve(normalized);

        // Verifica se existe antes de remover
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log("🗑 Arquivo removido:", absolutePath);
        } else {
            console.log("⚠ Arquivo NÃO encontrado:", absolutePath);
        }

    } catch (error) {
        console.error("❌ Erro ao remover arquivo:", error);
    }
};
