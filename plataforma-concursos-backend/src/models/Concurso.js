// ============================================================================
// 📄 Model Concurso (Atualizado para evitar problemas de timezone)
// ----------------------------------------------------------------------------
// Neste model, TODAS as datas são armazenadas como STRING no formato
// YYYY-MM-DD, exatamente como enviadas pelo Postman ou pelo Frontend.
//
// Por que STRING?
// - Evita o bug de “um dia antes” causado por UTC
// - Portais de concurso usam datas sem horário
// - Facilita listagem, filtros, ordenações e exibição
// ============================================================================

import mongoose from "mongoose";

const ConcursoSchema = new mongoose.Schema(
  {
    // ----------------------------------------------------------
    // 🏷 Título do concurso
    // ----------------------------------------------------------
    titulo: {
      type: String,
      required: true,
      trim: true,
    },

    // ----------------------------------------------------------
    // 🏛 Órgão responsável
    // ----------------------------------------------------------
    orgao: {
      type: String,
      required: true,
      trim: true,
    },

    // ----------------------------------------------------------
    // 📑 Edital (nome do edital), NÃO é o arquivo
    // ----------------------------------------------------------
    edital: {
      type: String,
      required: false,
      trim: true,
    },

    // ----------------------------------------------------------
    // 📝 Descrição do concurso
    // ----------------------------------------------------------
    descricao: {
      type: String,
      required: true,
    },

    // ----------------------------------------------------------
    // 📅 Datas (armazenadas como STRING para evitar timezone)
    // Formato: YYYY-MM-DD
    // ----------------------------------------------------------
    dataInicioInscricao: {
      type: String,
      required: true,
    },
    dataFimInscricao: {
      type: String,
      required: true,
    },
    dataProva: {
      type: String,
      required: true,
    },

    // ----------------------------------------------------------
    // 🔄 Status do concurso
    // - "aberto"
    // - "encerrado"
    // - "em breve"
    // ----------------------------------------------------------
    status: {
      type: String,
      enum: ["aberto", "encerrado", "em breve"],
      default: "em breve",
    },

    // ----------------------------------------------------------
    // 📎 Lista de documentos enviados
    // Cada documento contém: nome + caminho (uploads/arquivo.pdf)
    // ----------------------------------------------------------
    documentos: [
      {
        nome: { type: String },
        caminho: { type: String },
      },
    ],
  },

  // ----------------------------------------------------------
  // 🕒 Timestamps (createdAt e updatedAt)
  // ----------------------------------------------------------
  { timestamps: true }
);

// Exportar model
export default mongoose.model("Concurso", ConcursoSchema);
