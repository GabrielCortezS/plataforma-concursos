// Esse model cria cargos vinculados a um concurso
 //Cada cargo tem nome, vagas, salário e requisitos

import mongoose from "mongoose";


//Schema dos cargos que pertencem a um concurso

const CargoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },

    vagas: {
        type: Number,
        required: true
    },

    salario: {
        type: Number,
        required: true
    },

    requisitos:{
        type: String,
        required: true
    },

    //Relacionamento com o concurso

    concursoId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concurso",
        required: true
    }
}, { timestamps: true});

// Exporta o model

export default mongoose.model("Cargo", CargoSchema);
