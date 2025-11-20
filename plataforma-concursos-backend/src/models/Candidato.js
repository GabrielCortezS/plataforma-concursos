import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const CandidatoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    cpf: {
      type: String,
      required: true,
      unique: true,
    },

    senha: {
      type: String,
      required: true,
      select: false, // Não retorna a senha nas consultas
    }
  },
  { timestamps: true }
);

// 🔐 Criptografar senha antes de salvar
CandidatoSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);

  next();
});

// 🔐 Método para comparar senha
CandidatoSchema.methods.compararSenha = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

export default mongoose.model("Candidato", CandidatoSchema);
