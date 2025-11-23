// src/controllers/concursoController.js
import Concurso from "../models/Concurso.js";
import Cargo from "../models/Cargo.js";
import fs from "fs";
import path from "path";
import { deleteFile } from "../utils/fileUtils.js";

/*
|--------------------------------------------------------------------------
| 1) CRIAR CONCURSO — Datas como STRING + Upload de documentos
|--------------------------------------------------------------------------
*/
export const criarConcurso = async (req, res) => {
  try {
    const documentosProcessados = [];

    // 📎 Processa arquivos enviados
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        documentosProcessados.push({
          nome: file.originalname,
          caminho: file.path.replace(/\\/g, "/"),
          tipo: file.mimetype,
          enviadoEm: new Date(),
        });
      });
    }

    // 🟦 Cria o concurso (datas são strings YYYY-MM-DD)
    const novoConcurso = await Concurso.create({
      titulo: req.body.titulo,
      orgao: req.body.orgao,
      edital: req.body.edital,
      descricao: req.body.descricao,
      dataInicioInscricao: req.body.dataInicioInscricao,
      dataFimInscricao: req.body.dataFimInscricao,
      dataProva: req.body.dataProva,
      status: req.body.status,
      documentos: documentosProcessados,
    });

    return res.status(201).json({
      mensagem: "Concurso criado com sucesso",
      novoConcurso,
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar concurso",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 2) LISTAR CONCURSOS
|--------------------------------------------------------------------------
*/
export const listarConcursos = async (req, res) => {
  try {
    const concursos = await Concurso.find().sort({ createdAt: -1 });
    return res.json(concursos);

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar concursos",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 3) BUSCAR CONCURSO POR ID
|--------------------------------------------------------------------------
*/
export const buscarConcursoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const concurso = await Concurso.findById(id);

    if (!concurso) {
      return res.status(404).json({
        mensagem: "Concurso não encontrado",
      });
    }

    return res.json(concurso);

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar concurso",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 4) ATUALIZAR CONCURSO (OPÇÃO 3 — substitui documentos apenas se enviar)
|--------------------------------------------------------------------------
*/
export const atualizarConcurso = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Busca concurso existente
    const concurso = await Concurso.findById(id);

    if (!concurso) {
      return res.status(404).json({
        mensagem: "Concurso não encontrado",
      });
    }

    let documentosFinal = concurso.documentos; // Mantém documentos antigos por padrão

    // 📎 Se arquivos novos foram enviados → REMOVER antigos + substituir
    if (req.files && req.files.length > 0) {

      // 🗑 Apaga arquivos antigos do servidor
      if (concurso.documentos && concurso.documentos.length > 0) {
        concurso.documentos.forEach((doc) => deleteFile(doc.caminho));
      }

      documentosFinal = req.files.map((file) => ({
        nome: file.originalname,
        caminho: file.path.replace(/\\/g, "/"),
        tipo: file.mimetype,
        enviadoEm: new Date(),
      }));
    }

    // 🟦 Atualizar campos (datas são strings)
    const concursoAtualizado = await Concurso.findByIdAndUpdate(
      id,
      {
        titulo: req.body.titulo ?? concurso.titulo,
        orgao: req.body.orgao ?? concurso.orgao,
        edital: req.body.edital ?? concurso.edital,
        descricao: req.body.descricao ?? concurso.descricao,

        dataInicioInscricao: req.body.dataInicioInscricao ?? concurso.dataInicioInscricao,
        dataFimInscricao: req.body.dataFimInscricao ?? concurso.dataFimInscricao,
        dataProva: req.body.dataProva ?? concurso.dataProva,

        status: req.body.status ?? concurso.status,

        documentos: documentosFinal,
      },
      { new: true }
    );

    return res.json({
      mensagem: "Concurso atualizado com sucesso",
      concursoAtualizado,
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar concurso",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 5) DELETAR CONCURSO + documentos + cargos vinculados
|--------------------------------------------------------------------------
*/
export const deletarConcurso = async (req, res) => {
  try {
    const { id } = req.params;

    const concurso = await Concurso.findById(id);
    if (!concurso) {
      return res.status(404).json({ mensagem: "Concurso não encontrado" });
    }

    // 🗑 Remover documentos físicos
    if (concurso.documentos.length > 0) {
      concurso.documentos.forEach((doc) => deleteFile(doc.caminho));
    }

    // 🗑 Deletar cargos vinculados
    const cargos = await Cargo.find({ concursoId: id });
    for (const cargo of cargos) {
      await Cargo.findByIdAndDelete(cargo._id);
    }

    // 🗑 Remover concurso
    await Concurso.findByIdAndDelete(id);

    return res.json({
      mensagem: "Concurso e cargos vinculados deletados com sucesso",
      cargosRemovidos: cargos.length,
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar concurso",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 6) DOWNLOAD DE DOCUMENTOS
|--------------------------------------------------------------------------
*/
export const downloadDocumento = (req, res) => {
  try {
    const arquivo = req.params.arquivo;

    const caminhoArquivo = path
      .join("uploads/documentos", arquivo)
      .replace(/\\/g, "/");

    if (fs.existsSync(caminhoArquivo)) {
      return res.download(caminhoArquivo);
    }

    return res.status(404).json({ mensagem: "Arquivo não encontrado" });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao realizar download",
      erro: error.message,
    });
  }
};
