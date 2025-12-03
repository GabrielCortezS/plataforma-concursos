// ============================================================================
// 📄 CONCURSO CONTROLLER — VERSÃO PADRONIZADA E CORRIGIDA
// ============================================================================
// - Datas 100% compatíveis com o frontend (strings YYYY-MM-DD)
// - Upload funciona com 1 OU vários arquivos
// - Documentos antigos só são removidos quando realmente substituir
// - Status pode ser calculado automaticamente (opcional)
// - Totalmente alinhado ao Model e ao Front
// ============================================================================

import Concurso from "../models/Concurso.js";
import Cargo from "../models/Cargo.js";
import fs from "fs";
import path from "path";
import { deleteFile } from "../utils/fileUtils.js";

// ============================================================================
// 1) CRIAR CONCURSO
// ============================================================================
export const criarConcurso = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | 📎 Processar documentos enviados (1 ou vários)
    |--------------------------------------------------------------------------
    */
    const documentosProcessados = [];

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

    /*
    |--------------------------------------------------------------------------
    | 🟦 Criar novo concurso
    |--------------------------------------------------------------------------
    */
    const novoConcurso = await Concurso.create({
      titulo: req.body.titulo,
      orgao: req.body.orgao,
      edital: req.body.edital,
      descricao: req.body.descricao,

      // Datas chegam como string do frontend
      dataInicioInscricao: req.body.dataInicioInscricao,
      dataFimInscricao: req.body.dataFimInscricao,
      dataProva: req.body.dataProva,

      // Status pode vir do front ou calcularmos automaticamente
      status: req.body.status ?? "em breve",

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

// ============================================================================
// 2) LISTAR CONCURSOS (Público + Admin)
// ============================================================================
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

// ============================================================================
// 3) BUSCAR CONCURSO POR ID
// ============================================================================
export const buscarConcursoPorId = async (req, res) => {
  try {
    const concurso = await Concurso.findById(req.params.id);

    if (!concurso) {
      return res.status(404).json({ mensagem: "Concurso não encontrado" });
    }

    return res.json(concurso);

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar concurso",
      erro: error.message,
    });
  }
};

// ============================================================================
// 4) ATUALIZAR CONCURSO
// ============================================================================
export const atualizarConcurso = async (req, res) => {
  try {
    const { id } = req.params;

    const concurso = await Concurso.findById(id);

    if (!concurso) {
      return res.status(404).json({
        mensagem: "Concurso não encontrado",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | 📎 Processar documentos enviados
    | - Se enviar novos, apaga todos os antigos
    | - Se não enviar, mantém os documentos existentes
    |--------------------------------------------------------------------------
    */
    let documentosFinal = concurso.documentos;

    if (req.files && req.files.length > 0) {
      // 🔥 Apagar documentos antigos
      concurso.documentos.forEach((doc) => deleteFile(doc.caminho));

      documentosFinal = req.files.map((file) => ({
        nome: file.originalname,
        caminho: file.path.replace(/\\/g, "/"),
        tipo: file.mimetype,
        enviadoEm: new Date(),
      }));
    }

    /*
    |--------------------------------------------------------------------------
    | 🟦 Atualizar campos
    |--------------------------------------------------------------------------
    */
    const concursoAtualizado = await Concurso.findByIdAndUpdate(
      id,
      {
        titulo: req.body.titulo ?? concurso.titulo,
        orgao: req.body.orgao ?? concurso.orgao,
        edital: req.body.edital ?? concurso.edital,
        descricao: req.body.descricao ?? concurso.descricao,

        dataInicioInscricao:
          req.body.dataInicioInscricao ?? concurso.dataInicioInscricao,

        dataFimInscricao:
          req.body.dataFimInscricao ?? concurso.dataFimInscricao,

        dataProva:
          req.body.dataProva ?? concurso.dataProva,

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

// ============================================================================
// 5) DELETAR CONCURSO + documentos + cargos vinculados
// ============================================================================
export const deletarConcurso = async (req, res) => {
  try {
    const { id } = req.params;

    const concurso = await Concurso.findById(id);

    if (!concurso)
      return res.status(404).json({ mensagem: "Concurso não encontrado" });

    // Apaga documentos físicos
    concurso.documentos.forEach((doc) => deleteFile(doc.caminho));

    // Apaga cargos vinculados
    await Cargo.deleteMany({ concursoId: id });

    // Apaga concurso
    await Concurso.findByIdAndDelete(id);

    return res.json({
      mensagem: "Concurso e cargos vinculados deletados com sucesso",
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar concurso",
      erro: error.message,
    });
  }
};

// ============================================================================
// 6) DOWNLOAD DE DOCUMENTOS
// ============================================================================
export const downloadDocumento = (req, res) => {
  try {
    const arquivo = req.params.arquivo;

    const caminho = path
      .join("uploads/documentos", arquivo)
      .replace(/\\/g, "/");

    if (!fs.existsSync(caminho)) {
      return res.status(404).json({ mensagem: "Arquivo não encontrado" });
    }

    return res.download(caminho);

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao realizar download",
      erro: error.message,
    });
  }
};
