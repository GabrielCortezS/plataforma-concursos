// src/models/Inscricao.js
// Model de Inscrição do candidato

import mongoose from "mongoose";

const InscricaoSchema = new mongoose.Schema(
  {
    // Dados básicos do candidato
    nomeCompleto: { type: String, required: true },
    cpf: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },

    // Relacionamentos
    concursoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concurso",
      required: true,
    },
    cargoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cargo",
      required: true,
    },

    // Foto 3x4 salva no servidor
    foto: {
      type: String, // ex: "uploads/fotos/xxxx.png"
    },

    // Termos e auditoria de concordância
    concordaTermos: {
      type: Boolean,
      default: false,
    },
    dataConcordancia: {
      type: Date,
    },
    ipConcordancia: {
      type: String,
    },
    userAgent: {
      type: String,
    },

    // 🔹 Número único da inscrição (para mostrar no comprovante)
    numeroInscricao: {
      type: String,
      required: true,
      unique: true,
    },

    // 🔹 Caminho do PDF do comprovante
    comprovantePdf: {
      type: String, // ex: "uploads/comprovantes/comprovante_<id>.pdf"
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

export default mongoose.model("Inscricao", InscricaoSchema);
