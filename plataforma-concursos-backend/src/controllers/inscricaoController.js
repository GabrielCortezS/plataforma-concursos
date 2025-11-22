// src/controllers/inscricaoController.js

import Inscricao from "../models/Inscricao.js";
import Concurso from "../models/Concurso.js";
import Cargo from "../models/Cargo.js";
import { deleteFile } from "../utils/fileUtils.js";
import { gerarComprovanteInscricao } from "../utils/gerarComprovanteInscricao.js";

/*
|--------------------------------------------------------------------------
| CRIAR INSCRIÇÃO (PÚBLICO)
| - Recebe dados do candidato + ID do concurso + ID do cargo
| - Salva foto 3x4
| - Gera número de inscrição
| - Gera comprovante em PDF automaticamente
|--------------------------------------------------------------------------
*/
export const criarInscricao = async (req, res) => {
  try {
    // Dados enviados no body
    const {
      nomeCompleto,
      cpf,
      email,
      telefone,
      concursoId,
      cargoId,
      concordaTermos,
    } = req.body;

    // Validação obrigatória do termo
    if (!concordaTermos || concordaTermos === "false") {
      return res.status(400).json({
        mensagem:
          "É necessário concordar com os termos para realizar a inscrição.",
      });
    }

    // Captura do IP e User-Agent do candidato
    const ipConcordancia =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"] || "desconhecido";

    // Caminho da foto enviada (se houver upload)
    const caminhoFoto = req.file ? req.file.path : null;

    // Gera um número de inscrição padronizado
    const anoAtual = new Date().getFullYear();
    const numeroSequencial = Math.floor(Math.random() * 999999)
      .toString()
      .padStart(6, "0");
    const numeroInscricao = `INEPAS-${anoAtual}-${numeroSequencial}`;

    // Criação da inscrição no banco
    const novaInscricao = await Inscricao.create({
      nomeCompleto,
      cpf,
      email,
      telefone,
      concursoId,
      cargoId,
      foto: caminhoFoto,
      concordaTermos: true,
      dataConcordancia: new Date(),
      ipConcordancia,
      userAgent,
      numeroInscricao,
    });

    // -------------------------------------------------------------------
    //  GERAR COMPROVANTE EM PDF
    // -------------------------------------------------------------------

    let caminhoComprovante = null;

    try {
      // Buscar dados completos do concurso e cargo
      const concurso = await Concurso.findById(concursoId);
      const cargo = await Cargo.findById(cargoId);

      // Gera o PDF e retorna o caminho final
      caminhoComprovante = await gerarComprovanteInscricao({
        inscricao: novaInscricao,
        concurso,
        cargo,
      });

      // Salva caminho no banco
      novaInscricao.comprovantePdf = caminhoComprovante;
      await novaInscricao.save();
    } catch (errorPdf) {
      console.error("Erro ao gerar comprovante em PDF:", errorPdf.message);
      // Inscrição continua válida mesmo que o PDF falhe
    }

    // -------------------------------------------------------------------
    //  🔗 MONTAR URL ABSOLUTA DO COMPROVANTE (CORRIGIDA)
    // -------------------------------------------------------------------
    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    const comprovanteUrl = caminhoComprovante
      ? `${baseUrl}/${caminhoComprovante.replace(/^\/*/, "")}`
      : null;

    return res.status(201).json({
      mensagem: "Inscrição realizada com sucesso",
      inscricao: novaInscricao,
      comprovanteUrl, // usado no frontend
    });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar inscrição",
      erro: error.message,
    });
  }
};

// =====================================================================
// Download da foto do candidato
// =====================================================================
export const downloadFoto = async (req, res) => {
  try {
    const { id } = req.params;

    const inscricao = await Inscricao.findById(id);

    if (!inscricao) {
      return res.status(404).json({
        mensagem: "Inscrição não encontrada",
      });
    }

    if (!inscricao.foto) {
      return res.status(404).json({
        mensagem: "Nenhuma foto foi enviada para esta inscrição",
      });
    }

    return res.sendFile(
      inscricao.foto,
      { root: "./" },
      (erro) => {
        if (erro) {
          return res.status(500).json({
            mensagem: "Erro ao enviar arquivo",
            erro: erro.message,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao processar download da foto",
      erro: error.message,
    });
  }
};

// =====================================================================
// Listar inscrições
// =====================================================================
export const listarInscricoes = async (req, res) => {
  try {
    const inscricoes = await Inscricao.find()
      .populate("concursoId")
      .populate("cargoId");

    res.json(inscricoes);
  } catch (error) {
    res.status(500).json({
      mensagem: "Error ao listar inscrições",
      erro: error.message,
    });
  }
};

// =====================================================================
// Buscar inscrição por ID
// =====================================================================
export const buscarInscricaoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const inscricao = await Inscricao.findById(id)
      .populate("concursoId")
      .populate("cargoId");

    if (!inscricao) {
      return res.status(404).json({
        mensagem: "Inscrição não encontrada",
      });
    }

    res.json(inscricao);
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao buscar inscrição",
      erro: error.message,
    });
  }
};

// =====================================================================
// Atualizar inscrição
// =====================================================================
export const atualizarInscricao = async (req, res) => {
  try {
    const { id } = req.params;

    const inscricao = await Inscricao.findById(id);

    if (!inscricao) {
      return res.status(404).json({
        mensagem: "Inscrição não encontrada",
      });
    }

    const camposBloqueados = [
      "status",
      "dataConcordancia",
      "ipConcordancia",
      "userAgent",
      "concursoId",
      "cargoId",
      "numeroInscricao",
      "comprovantePdf",
    ];

    camposBloqueados.forEach((campo) => {
      if (req.body[campo] !== undefined) delete req.body[campo];
    });

    if (req.file) {
      if (inscricao.foto) deleteFile(inscricao.foto);
      req.body.foto = req.file.path;
    }

    const inscricaoAtualizada = await Inscricao.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.json({
      mensagem: "Inscrição atualizada com sucesso",
      inscricao: inscricaoAtualizada,
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao atualizar inscrição",
      erro: error.message,
    });
  }
};

// =====================================================================
// Deletar inscrição
// =====================================================================
export const deletarInscricao = async (req, res) => {
  try {
    const { id } = req.params;

    const inscricao = await Inscricao.findById(id);

    if (!inscricao) {
      return res.status(404).json({
        mensagem: "Inscrição não encontrada",
      });
    }

    if (inscricao.foto) {
      const caminhoCorrigido = inscricao.foto.replace(/\\/g, "/");
      deleteFile(caminhoCorrigido);
    }

    await Inscricao.findByIdAndDelete(id);

    res.json({
      mensagem: "Inscrição removida com sucesso",
    });
  } catch (error) {
    res.status(500).json({
      mensagem: "Erro ao deletar inscrição",
      erro: error.message,
    });
  }
};
