// src/models/Inscricao.js
// Model da inscrição do candidato

import mongoose from "mongoose";

const InscricaoSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | 🔹 Dados básicos do candidato (copiados no momento da inscrição)
    |--------------------------------------------------------------------------
    */
    nomeCompleto: { type: String, required: true },
    cpf: { type: String, required: true },
    email: { type: String, required: true },
    telefone: { type: String, required: true },

    /*
    |--------------------------------------------------------------------------
    | 🔹 RELACIONAMENTO: Candidato logado que fez a inscrição
    |--------------------------------------------------------------------------
    */
    candidatoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidato",
      required: true,
    },

    /*
    |--------------------------------------------------------------------------
    | 🔹 Relacionamentos com Concurso e Cargo
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | 🔹 Foto 3x4 enviada pelo candidato
    |--------------------------------------------------------------------------
    */
    foto: {
      type: String, // ex: "uploads/fotos/xxxx.png"
    },

    /*
    |--------------------------------------------------------------------------
    | 🔹 Termos e auditoria de concordância
    |--------------------------------------------------------------------------
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
    |--------------------------------------------------------------------------
    | 🔹 Número único da inscrição (usado no comprovante)
    |--------------------------------------------------------------------------
    */
    numeroInscricao: {
      type: String,
      required: true,
      unique: true,
    },

    /*
    |--------------------------------------------------------------------------
    | 🔹 Caminho do comprovante PDF gerado
    |--------------------------------------------------------------------------
    */
    comprovantePdf: {
      type: String, // ex: "uploads/comprovantes/xxx.pdf"
    },

    /*
    |--------------------------------------------------------------------------
    | 🔹 Informações de pagamento (Mercado Pago)
    |--------------------------------------------------------------------------
    | Salvas após a criação da preferência de pagamento.
    | Usadas para consulta, webhook e painel do candidato.
    |--------------------------------------------------------------------------
    */
    paymentId: {
      type: String, // ID da preferência criada no Mercado Pago
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["pendente", "processando", "pago", "cancelado"],
      default: "pendente",
    },

    paymentInitPoint: {
      type: String, // URL de checkout
      default: null,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

export default mongoose.model("Inscricao", InscricaoSchema);
