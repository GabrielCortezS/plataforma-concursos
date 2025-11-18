import Concurso from "../models/Concurso.js";
import fs from "fs";
import path from "path";
import { deleteFile } from "../utils/fileUtils.js";

/*
|--------------------------------------------------------------------------
| 1) CRIAR CONCURSO  (UPLOAD DE DOCUMENTOS)
|--------------------------------------------------------------------------
*/
export const criarConcurso = async (req, res) => {
  try {
    const documentosProcessados = [];

    // Processa documentos enviados (PDFs, imagens etc)
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        documentosProcessados.push({
          nome: file.originalname,
          caminho: file.path.replace(/\\/g, "/"), // normaliza caminho
          tipo: file.mimetype,
          enviadoEm: new Date(),
        });
      });
    }

    // Cria o concurso
    const novoConcurso = await Concurso.create({
      ...req.body,
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
| 2) LISTAR TODOS OS CONCURSOS
|--------------------------------------------------------------------------
*/
export const listarConcursos = async (req, res) => {
  try {
    const concursos = await Concurso.find();
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

/*
|--------------------------------------------------------------------------
| 4) ATUALIZAR CONCURSO (REMOVE DOCS ANTIGOS + NOVOS UPLOADS)
|--------------------------------------------------------------------------
*/
export const atualizarConcurso = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o concurso atual
    const concurso = await Concurso.findById(id);

    if (!concurso) {
      return res.status(404).json({
        mensagem: "Concurso não encontrado",
      });
    }

    let novosDocumentos = [];

    // Se novos arquivos foram enviados:
    if (req.files && req.files.length > 0) {

      // 🗑 REMOVER ARQUIVOS ANTIGOS
      if (concurso.documentos && concurso.documentos.length > 0) {
        concurso.documentos.forEach((doc) => {
          const caminhoCorrigido = doc.caminho.replace(/\\/g, "/");
          deleteFile(caminhoCorrigido);
        });
      }

      // SALVAR NOVOS DOCUMENTOS
      novosDocumentos = req.files.map((file) => ({
        nome: file.originalname,
        caminho: file.path.replace(/\\/g, "/"),
        tipo: file.mimetype,
        enviadoEm: new Date(),
      }));
    }

    // Atualiza concurso no banco
    const concursoAtualizado = await Concurso.findByIdAndUpdate(
      id,
      {
        ...req.body,
        documentos:
          req.files && req.files.length > 0
            ? novosDocumentos
            : concurso.documentos,
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
| 5) DELETAR CONCURSO (REMOVE DOCUMENTOS DO SERVIDOR)
|--------------------------------------------------------------------------
*/
export const deletarConcurso = async (req, res) => {
  try {
    const { id } = req.params;

    const concurso = await Concurso.findById(id);

    if (!concurso) {
      return res.status(404).json({
        mensagem: "Concurso não encontrado",
      });
    }

    // 🗑 Remover documentos antigos
    if (concurso.documentos && concurso.documentos.length > 0) {
      concurso.documentos.forEach((doc) => {
        const caminhoCorrigido = doc.caminho.replace(/\\/g, "/");
        deleteFile(caminhoCorrigido);
      });
    }

    // Remover do banco
    await Concurso.findByIdAndDelete(id);

    return res.json({
      mensagem: "Concurso deletado com sucesso",
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

    // Normaliza caminho
    const caminhoArquivo = path.join("uploads/documentos", arquivo).replace(/\\/g, "/");

    if (fs.existsSync(caminhoArquivo)) {
      return res.download(caminhoArquivo);
    } else {
      return res.status(404).json({ mensagem: "Arquivo não encontrado" });
    }

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao realizar download",
      erro: error.message,
    });
  }
};
