import mongoose from "mongoose";
import bcrypt from "bcrypt";


// Define o esquema (estrutura) do admnistrador

const AdminSchema = new mongoose.Schema(
    {
        nome:{
            type: String,
            required: true,
            unique: true, // garante que não existam emails duplicados
        },

        email:{
            type: String,
            required: true,
        },
        
        senha: {
            type:String,
        required: true,
        },
    },
    {timestamps:true} // cria automaticamente createdAt e updateAt

);

// antes de salvar no banco, criptografa a senha

AdminSchema.pre("save", async function(next) {
    if (!this.isModified("senha")) return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

// Metodo para comparar senhas no login

AdminSchema.methods.compararSenha = async function (senhaDigitada){
    return await bcrypt.compare(senhaDigitada, this.senha);

};

// Exporta o modelo para uso em controllers

export default mongoose.model("Admin", AdminSchema);


