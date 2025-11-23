// src/models/Inscricao.js
// Model de Inscrição do candidato

import mongoose from "mongoose";

const InscricaoSchema = new mongoose.Schema(
  {
    /*
    |---------------------------------------------------------------
    | 🔹 Dados básicos do candidato (copiados no momento da inscrição)
    |---------------------------------------------------------------
    */
    nomeCompleto: { type: String, required: true },
    cpf: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },

    /*
    |---------------------------------------------------------------
    | 🔹 RELACIONAMENTO: Candidato logado que fez a inscrição
    |---------------------------------------------------------------
    */
    candidatoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidato",
      required: true, // ← necessário para listar/minhas-inscrições
    },

    /*
    |---------------------------------------------------------------
    | 🔹 Relacionamentos com Concurso e Cargo
    |---------------------------------------------------------------
    */
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

    /*
    |---------------------------------------------------------------
    | 🔹 Foto 3x4 enviada pelo candidato
    |---------------------------------------------------------------
    */
    foto: {
      type: String, // ex: "uploads/fotos/xxxx.png"
      required: false,
    },

    /*
    |---------------------------------------------------------------
    | 🔹 Termos e auditoria de concordância
    |---------------------------------------------------------------
    */
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

    /*
    |---------------------------------------------------------------
    | 🔹 Número único da inscrição (aparece no comprovante)
    |---------------------------------------------------------------
    */
    numeroInscricao: {
      type: String,
      required: true,
      unique: true,
    },

    /*
    |---------------------------------------------------------------
    | 🔹 Caminho do PDF gerado automaticamente
    |---------------------------------------------------------------
    */
    comprovantePdf: {
      type: String, // ex: "uploads/comprovantes/comprovante_<id>.pdf"
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

export default mongoose.model("Inscricao", InscricaoSchema);
