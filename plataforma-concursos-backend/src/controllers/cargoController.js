// controllers/cargoController.js
// --------------------------------------------------------------
// CONTROLLER DE CARGOS
// Cada cargo pertence a um concurso (via concursoId)
// --------------------------------------------------------------

import Cargo from "../models/Cargo.js";

/*
|--------------------------------------------------------------------------
| 1) CRIAR NOVO CARGO
|--------------------------------------------------------------------------
*/
export const criarCargo = async (req, res) => {
  try {
    // Cria cargo diretamente com os dados enviados
    const novoCargo = await Cargo.create(req.body);

    res.status(201).json({
      mensagem: "Cargo criado com sucesso",
      novoCargo
    });

  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao criar cargo",
      erro: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| 2) LISTAR TODOS OS CARGOS
|--------------------------------------------------------------------------
*/
export const listarCargos = async (req, res) => {
  try {
    // Lista todos os cargos e popula o concurso vinculado
    const cargos = await Cargo.find().populate("concursoId");

    res.json({ cargos });

  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao listar cargos",
      erro: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| 3) LISTAR CARGO POR ID
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| 4) LISTAR CARGOS VINCULADOS A UM CONCURSO ESPECÍFICO
|--------------------------------------------------------------------------
| Essa rota devolve APENAS os cargos do concurso informado
| Isso evita filtros no front e garante dados consistentes
|--------------------------------------------------------------------------
*/
export const listarCargosPorConcurso = async (req, res) => {
  try {
    const { concursoId } = req.params;

    // Busca cargos cujo campo concursoId = concursoId fornecido
    const cargos = await Cargo.find({ concursoId }).populate("concursoId");

    return res.json({ cargos });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar cargos por concurso",
      erro: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| 5) ATUALIZAR CARGO
|--------------------------------------------------------------------------
*/
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

/*
|--------------------------------------------------------------------------
| 6) DELETAR CARGO
|--------------------------------------------------------------------------
*/
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
