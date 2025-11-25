// src/controllers/inscricaoController.js
// Controlador responsável pela gestão completa das inscrições

import Inscricao from "../models/Inscricao.js";
import Concurso from "../models/Concurso.js";
import Cargo from "../models/Cargo.js";
import { deleteFile } from "../utils/fileUtils.js";
import { gerarComprovanteInscricao } from "../utils/gerarComprovanteInscricao.js";

/*
|--------------------------------------------------------------------------
| 🟩 CRIAR INSCRIÇÃO (CANDIDATO)
| - Salva dados + foto
| - Associa ao candidato autenticado
| - Gera comprovante PDF automaticamente
|--------------------------------------------------------------------------
*/
export const criarInscricao = async (req, res) => {
  try {
    const {
      nomeCompleto,
      cpf,
      email,
      telefone,
      concursoId,
      cargoId,
      concordaTermos,
    } = req.body;

    if (!concordaTermos || concordaTermos === "false") {
      return res.status(400).json({
        mensagem: "É necessário concordar com os termos para realizar a inscrição.",
      });
    }

    const ipConcordancia =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const userAgent = req.headers["user-agent"] || "desconhecido";

    const caminhoFoto = req.file ? req.file.path : null;

    const anoAtual = new Date().getFullYear();
    const numeroSequencial = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, "0");

    const numeroInscricao = `INEPAS-${anoAtual}-${numeroSequencial}`;

    const novaInscricao = await Inscricao.create({
      nomeCompleto,
      cpf,
      email,
      telefone,
      concursoId,
      cargoId,
      candidatoId: req.usuario?.id || null,
      foto: caminhoFoto,
      concordaTermos: true,
      dataConcordancia: new Date(),
      ipConcordancia,
      userAgent,
      numeroInscricao,
    });

    /*
    |--------------------------------------------------------------------------
    | GERAR COMPROVANTE PDF
    |--------------------------------------------------------------------------
    */
    let caminhoComprovante = null;

    try {
      const concurso = await Concurso.findById(concursoId);
      const cargo = await Cargo.findById(cargoId);

      caminhoComprovante = await gerarComprovanteInscricao({
        inscricao: novaInscricao,
        concurso,
        cargo,
      });

      novaInscricao.comprovantePdf = caminhoComprovante;
      await novaInscricao.save();
    } catch (errorPdf) {
      console.error("Erro ao gerar comprovante:", errorPdf.message);
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    return res.status(201).json({
      mensagem: "Inscrição realizada com sucesso",
      inscricao: novaInscricao,
      comprovanteUrl: caminhoComprovante
        ? `${baseUrl}/${caminhoComprovante.replace(/^\/*/, "")}`
        : null,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar inscrição",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 🟩 LISTAR INSCRIÇÕES (ADMIN)
|--------------------------------------------------------------------------
*/
export const listarInscricoes = async (req, res) => {
  try {
    const inscricoes = await Inscricao.find()
      .populate("concursoId")
      .populate("cargoId")
      .populate("candidatoId");

    return res.json(inscricoes);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao listar inscrições",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 🟩 DOWNLOAD FOTO DO CANDIDATO (ADMIN)
|--------------------------------------------------------------------------
*/
export const downloadFoto = async (req, res) => {
  try {
    const { id } = req.params;

    const inscricao = await Inscricao.findById(id);

    if (!inscricao) {
      return res.status(404).json({ mensagem: "Inscrição não encontrada" });
    }

    if (!inscricao.foto) {
      return res.status(404).json({ mensagem: "Nenhuma foto enviada" });
    }

    return res.sendFile(inscricao.foto, { root: "./" });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao processar download da foto",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 🟩 BUSCAR INSCRIÇÃO POR ID (ADMIN)
|--------------------------------------------------------------------------
*/
export const buscarInscricaoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const inscricao = await Inscricao.findById(id)
      .populate("concursoId")
      .populate("cargoId")
      .populate("candidatoId");

    if (!inscricao) {
      return res.status(404).json({ mensagem: "Inscrição não encontrada" });
    }

    return res.json(inscricao);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar inscrição",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 🟦 ATUALIZAR INSCRIÇÃO (ADMIN)
|--------------------------------------------------------------------------
*/
export const atualizarInscricao = async (req, res) => {
  try {
    const { id } = req.params;

    const inscricao = await Inscricao.findById(id);

    if (!inscricao) {
      return res.status(404).json({ mensagem: "Inscrição não encontrada" });
    }

    const camposBloqueados = [
      "dataConcordancia",
      "ipConcordancia",
      "userAgent",
      "numeroInscricao",
      "comprovantePdf",
      "candidatoId",
    ];

    camposBloqueados.forEach((campo) => delete req.body[campo]);

    if (req.file) {
      if (inscricao.foto) deleteFile(inscricao.foto);
      req.body.foto = req.file.path;
    }

    const atualizado = await Inscricao.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json({
      mensagem: "Inscrição atualizada com sucesso",
      inscricao: atualizado,
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao atualizar inscrição",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 🟩 DELETAR INSCRIÇÃO (ADMIN)
|--------------------------------------------------------------------------
*/
export const deletarInscricao = async (req, res) => {
  try {
    const { id } = req.params;

    const inscricao = await Inscricao.findById(id);

    if (!inscricao) {
      return res.status(404).json({ mensagem: "Inscrição não encontrada" });
    }

    if (inscricao.foto) deleteFile(inscricao.foto.replace(/\\/g, "/"));

    await inscricao.deleteOne();

    return res.json({ mensagem: "Inscrição removida com sucesso" });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao deletar inscrição",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 🟦 LISTAR INSCRIÇÕES DO CANDIDATO LOGADO
|--------------------------------------------------------------------------
*/
export const listarMinhasInscricoes = async (req, res) => {
  try {
    const candidatoId = req.usuario?.id;

    if (!candidatoId) {
      return res.status(401).json({ mensagem: "Candidato não autenticado" });
    }

    const inscricoes = await Inscricao.find({ candidatoId })
      .populate("concursoId")
      .populate("cargoId");

    return res.json({ inscricoes });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao carregar suas inscrições",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 🟦 BUSCAR INSCRIÇÃO DO CANDIDATO LOGADO
|--------------------------------------------------------------------------
*/
export const buscarInscricaoDoCandidato = async (req, res) => {
  try {
    const candidatoId = req.usuario?.id;
    const { id } = req.params;

    const inscricao = await Inscricao.findOne({
      _id: id,
      candidatoId,
    })
      .populate("concursoId")
      .populate("cargoId");

    if (!inscricao) {
      return res.status(404).json({
        mensagem: "Inscrição não encontrada ou não pertence a você.",
      });
    }

    return res.json({ inscricao });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar inscrição",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 📄 DOWNLOAD DO COMPROVANTE (CANDIDATO)
|--------------------------------------------------------------------------
*/
export const downloadComprovanteCandidato = async (req, res) => {
  try {
    const { id } = req.params;
    const candidatoId = req.usuario.id;

    const inscricao = await Inscricao.findOne({
      _id: id,
      candidatoId,
    });

    if (!inscricao) {
      return res.status(404).json({
        mensagem: "Inscrição não encontrada ou não pertence a você.",
      });
    }

    if (!inscricao.comprovantePdf) {
      return res.status(404).json({
        mensagem: "Nenhum comprovante gerado.",
      });
    }

    return res.sendFile(inscricao.comprovantePdf, { root: "./" });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao baixar comprovante",
      erro: error.message,
    });
  }
};
