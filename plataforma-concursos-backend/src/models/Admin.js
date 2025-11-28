// src/models/Admin.js
// Model do Administrador

import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // 🔥 CORRETO (bcryptjs)

// Estrutura do Administrador
const AdminSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true // 🔥 EMAIL deve ser único
        },

        senha: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true // cria createdAt / updatedAt automaticamente
    }
);

/*
|--------------------------------------------------------------------------
| 🔐 Antes de salvar → criptografar senha automaticamente
|--------------------------------------------------------------------------
*/
AdminSchema.pre("save", async function (next) {
    // Se a senha não foi alterada, continuar
    if (!this.isModified("senha")) return next();

    // Gerar hash
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);

    next();
});

/*
|--------------------------------------------------------------------------
| 🔑 Método do Model para comparar a senha no login
|--------------------------------------------------------------------------
*/
AdminSchema.methods.compararSenha = function (senhaDigitada) {
    return bcrypt.compare(senhaDigitada, this.senha);
};

export default mongoose.model("Admin", AdminSchema);
