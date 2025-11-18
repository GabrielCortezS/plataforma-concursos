import Inscricao from "../models/Inscricao.js";
import { deleteFile } from "../utils/fileUtils.js";

// Criar inscrição
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
      concordaTermos
    } = req.body;

    // Validação obrigatória do termo
    if (!concordaTermos || concordaTermos === "false") {
      return res.status(400).json({
        mensagem: "É necessário concordar com os termos para realizar a inscrição."
      });
    }

    // Captura do IP e User-Agent do candidato
    const ipConcordancia = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"] || "desconhecido";

    // Caminho da foto enviada (se houver upload)
    const caminhoFoto = req.file ? req.file.path : null;

    // Criação da inscrição
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
    });

    return res.status(201).json({
      mensagem: "Inscrição realizada com sucesso",
      novaInscricao,
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao criar inscrição",
      erro: error.message
    });
  }
};

// ================================
// Download da foto do candidato
// ================================
export const downloadFoto = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca inscrição pelo ID
    const inscricao = await Inscricao.findById(id);

    if (!inscricao) {
      return res.status(404).json({
        mensagem: "Inscrição não encontrada"
      });
    }

    // Verifica se a inscrição tem foto salva
    if (!inscricao.foto) {
      return res.status(404).json({
        mensagem: "Nenhuma foto foi enviada para esta inscrição"
      });
    }

    // Monta caminho completo da foto
    const caminhoFoto = inscricao.foto; // já vem como "uploads/xxxx.png"

    return res.sendFile(
      caminhoFoto,
      { root: "./" }, // importante
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
      erro: error.message
    });
  }
};
// Listar todas as inscrições (somente admin)

export const listarInscricoes = async (req, res) => {
    try{
        const inscricoes = await Inscricao.find()
        // Popula o campo "concursoId" com os dados do concurso relacionado
        // Em vez de retornar apenas o ID, traz o objeto completo do concurso
        .populate("concursoId")
        .populate("cargoId");

        res.json(inscricoes);

    } catch (error){
        res.status(500).json({
            mensagem: "Error ao listar inscrições",
            erro: error.message
        });
    }
};


//Buscar uma inscrição pelo ID

export const buscarInscricaoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const inscricao = await Inscricao.findById(id)
            .populate("concursoId")
            .populate("cargoId");

        if (!inscricao) {
            return res.status(404).json({
                mensagem: "Inscrição não encontrada"
            });
        }

        res.json(inscricao);

    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao buscar inscrição",
            erro: error.message
        });
    }
};

// Atualizar inscrição (com remoção da foto antiga + segurança)
export const atualizarInscricao = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar inscrição atual
        const inscricao = await Inscricao.findById(id);

        if (!inscricao) {
            return res.status(404).json({
                mensagem: "Inscrição não encontrada"
            });
        }

        // 🔒 Campos que NÃO podem ser alterados
        const camposBloqueados = [
            "status",
            "dataConcordancia",
            "ipConcordancia",
            "userAgent",
            "concursoId",
            "cargoId"
        ];

        // Remove campos bloqueados do body
        camposBloqueados.forEach(campo => {
            if (req.body[campo] !== undefined) {
                delete req.body[campo];
            }
        });

        // 🔥 1. SE O USUÁRIO ENVIOU NOVA FOTO
        if (req.file) {

            // Apaga a foto antiga, se existir
            if (inscricao.foto) {
                deleteFile(inscricao.foto);
            }

            // Grava nova foto
            req.body.foto = req.file.path;
        }

        // 🔥 2. Atualizar inscrição com campos permitidos
        const inscricaoAtualizada = await Inscricao.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.json({
            mensagem: "Inscrição atualizada com sucesso",
            inscricao: inscricaoAtualizada
        });

    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao atualizar inscrição",
            erro: error.message
        });
    }
};

// Deletar inscrição (remove foto também)
export const deletarInscricao = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Buscar a inscrição primeiro
        const inscricao = await Inscricao.findById(id);

        if (!inscricao) {
            return res.status(404).json({
                mensagem: "Inscrição não encontrada"
            });
        }

        // 2. Remover a foto, se houver
        if (inscricao.foto) {
    const caminhoCorrigido = inscricao.foto.replace(/\\/g, "/");
    deleteFile(caminhoCorrigido);
}

        // 3. Agora sim, deletar do banco
        await Inscricao.findByIdAndDelete(id);

        res.json({
            mensagem: "Inscrição removida com sucesso"
        });

    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao deletar inscrição",
            erro: error.message
        });
    }
};