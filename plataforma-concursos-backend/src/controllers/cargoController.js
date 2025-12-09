// ============================================================================
// 📌 CONTROLLER DE CARGOS
// Cada cargo pertence a um concurso (via campo concursoId).
// Este arquivo contém CRUD completo + filtros especializados.
// Todos os retornos foram padronizados para arrays diretos ou objetos simples,
// garantindo compatibilidade total com o frontend.
// ============================================================================

import Cargo from "../models/Cargo.js";

/*
|--------------------------------------------------------------------------
| 1) CRIAR NOVO CARGO
|--------------------------------------------------------------------------
| Recebe os dados via JSON e cria um cargo vinculado a um concurso.
| req.body deve conter:
|  - nome
|  - vagas
|  - salario
|  - requisitos
|  - concursoId
|--------------------------------------------------------------------------
*/
export const criarCargo = async (req, res) => {
  try {
    const novoCargo = await Cargo.create(req.body);

    return res.status(201).json({
      mensagem: "Cargo criado com sucesso",
      cargo: novoCargo
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar cargo",
      erro: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| 2) LISTAR TODOS OS CARGOS (PADRONIZADO)
|--------------------------------------------------------------------------
| Retorna diretamente o array [...], sem objetos intermediários.
| Compatível com o painel do Admin.
|--------------------------------------------------------------------------
*/
export const listarCargos = async (req, res) => {
  try {
    const cargos = await Cargo.find().populate("concursoId");

    return res.json(cargos); // ✔ retorno direto

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar cargos",
      erro: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| 3) LISTAR CARGO POR ID (PADRONIZADO)
|--------------------------------------------------------------------------
| Retorna o cargo diretamente.
| Usado tanto no Admin quanto em telas específicas.
|--------------------------------------------------------------------------
*/
export const listarCargoPorId = async (req, res) => {
  try {
    const cargo = await Cargo.findById(req.params.id).populate("concursoId");

    if (!cargo) {
      return res.status(404).json({ mensagem: "Cargo não encontrado" });
    }

    return res.json(cargo); // ✔ retorno direto

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar cargo",
      erro: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| 4) LISTAR CARGOS POR CONCURSO (CORRIGIDO)
|--------------------------------------------------------------------------
| Rota usada na tela de inscrição do candidato.
| Retorna apenas cargos com o campo concursoId = req.params.concursoId.
| Retorno = array direto.
|--------------------------------------------------------------------------
*/
export const listarCargosPorConcurso = async (req, res) => {
  try {
    const { concursoId } = req.params;

    const cargos = await Cargo.find({ concursoId }).populate("concursoId");

    return res.json(cargos); // ✔ retorno já compatível com o frontend

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar cargos do concurso",
      erro: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| 5) ATUALIZAR CARGO
|--------------------------------------------------------------------------
| Atualiza um cargo específico.
|--------------------------------------------------------------------------
*/
export const atualizarCargo = async (req, res) => {
  try {
    const cargoAtualizado = await Cargo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!cargoAtualizado) {
      return res.status(404).json({ mensagem: "Cargo não encontrado" });
    }

    return res.json({
      mensagem: "Cargo atualizado com sucesso",
      cargo: cargoAtualizado
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar cargo",
      erro: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| 6) DELETAR CARGO
|--------------------------------------------------------------------------
| Remove o cargo permanentemente do banco.
|--------------------------------------------------------------------------
*/
export const deletarCargo = async (req, res) => {
  try {
    const deletado = await Cargo.findByIdAndDelete(req.params.id);

    if (!deletado) {
      return res.status(404).json({ mensagem: "Cargo não encontrado" });
    }

    return res.json({
      mensagem: "Cargo deletado com sucesso"
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar cargo",
      erro: error.message
    });
  }
};
