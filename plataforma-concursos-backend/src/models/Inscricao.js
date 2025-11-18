import mongoose from "mongoose";

// Define a estrutura (schema) da inscrição
const InscricaoSchema = new mongoose.Schema(
  {
    nomeCompleto: {
      type: String,
      required: true,
    },

    cpf: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    telefone: {
      type: String,
    },

    // Relacionamento com Concurso
    concursoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concurso",
      required: true,
    },

    // Relacionamento com Cargo
    cargoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cargo",
      required: true,
    },

    // Caminho da foto enviada pelo candidato
    foto: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pendente", "confirmado", "cancelado"],
      default: "pendente",
    },

  
   //  Campos de Concordância
    
    concordaTermos: {
      type: Boolean,
      required: true, // obrigatório para criar inscrição
    },

    dataConcordancia: {
      type: Date, // data/hora exata da concordância
    },

    ipConcordancia: {
      type: String, // IP público do usuário
    },

    userAgent: {
      type: String, // Dispositivo/navegador utilizado
    },
  },
  { timestamps: true } // cria createdAt e updatedAt automaticamente
);

// Exporta o model para uso nos controllers
export default mongoose.model("Inscricao", InscricaoSchema);
