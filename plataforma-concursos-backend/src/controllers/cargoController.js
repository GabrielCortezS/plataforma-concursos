import Cargo from "../models/Cargo.js";

// Criar novo cargo
export const criarCargo = async (req, res) =>{

    try{
        const novoCargo = await Cargo.create(req.body);
        
        res.status(201).json({
            mensagem: "Cargo criado com sucesso",
            novoCargo
        });
    } catch (error){
        res.status(500).json({
            mensagem: "Erro ao criar cargo",
            erro: error.message
        });
    }
};

// Listar todos os cargos
export const listarCargos = async (req, res) => {
  try {
    const cargos = await Cargo.find().populate("concursoId");

    res.json({ cargos });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao listar cargos",
      erro: error.message
    });
  }
};

// Listar cargo por ID
export const listarCargoById = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id).populate("concursoId");

    res.json({ cargo });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar cargo",
      erro: error.message
    });
  }
};

// Atualizar cargo
export const atualizarCargo = async (req, res) => {
  try {
    const cargoAtualizado = await Cargo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      mensagem: "Cargo atualizado com sucesso",
      cargoAtualizado
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao atualizar cargo",
      erro: error.message
    });
  }
};

// Deletar cargo
export const deletarCargo = async (req, res) => {
  try {
    await Cargo.findByIdAndDelete(req.params.id);

    res.json({
      mensagem: "Cargo deletado com sucesso"
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao deletar cargo",
      erro: error.message
    });
  }
};