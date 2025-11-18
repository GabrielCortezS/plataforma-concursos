import mongoose from "mongoose";

//Define a estrutura (schema)do concurso

const ConcursoSchema = new mongoose.Schema(
    {
    titulo: {
      type: String,
      required: true, // título do concurso (ex: Prefeitura de Recife)
    },

    orgao: {
      type: String,
      required: true, // nome do órgão responsável
    },

    edital: {
      type: String, // URL ou nome do arquivo do edital
    },

    descricao: {
      type: String, // descrição geral do concurso
    },

    dataInicioInscricao: {
      type: Date,
      required: true, // data em que abrem as inscrições
    },

    dataFimInscricao: {
      type: Date,
      required: true, // data em que encerram as inscrições
    },

    dataProva: {
      type: Date, // data prevista da prova
    },
    status: {
      type: String,
      enum: ["aberto", "encerrado", "em andamento"],
      default: "aberto",
    },

    // Campo para armazenar documentos do concurso (PDF, imagens, anexos)
documentos: [
  {
    nome: { type: String },      // Nome original do arquivo
    caminho: { type: String },   // Caminho salvo no servidor
    tipo: { type: String }       // Tipo do arquivo (pdf, image, etc)
  }
]
    
  },
  { timestamps: true } // cria automaticamente createdAt e updatedAt
);


//Exporta o model para uso em controllers
export default mongoose.model("Concurso", ConcursoSchema);