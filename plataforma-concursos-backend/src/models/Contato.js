// src/models/Contato.js
// Model responsável por armazenar mensagens enviadas pelo formulário de contato

import mongoose from "mongoose";

// Schema da mensagem enviada pelo usuário
const ContatoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    mensagem: {
      type: String,
      required: true,
    },

    // Dados adicionais úteis para o admin
    ip: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },

    // Status da mensagem: pendente, respondido
    status: {
      type: String,
      default: "pendente",
    },
  },
  { timestamps: true }
);

// Exporta o model
export default mongoose.model("Contato", ContatoSchema);
