import Candidato from "../models/Candidato.js";
import Inscricao from "../models/Inscricao.js";

export const meusDados = async (req, res) => {
  try {
    const candidatoId = req.user.id;

    const candidato = await Candidato.findById(candidatoId)
      .select("-senha");

    if (!candidato) {
      return res.status(404).json({ mensagem: "Candidato não encontrado" });
    }

    const inscricao = await Inscricao.findOne({ candidatoId })
    .populate("concursoId")
    .populate("cargoId");


    return res.json({
      candidato,
      inscricao
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao carregar dados do candidato",
      erro: error.message,
    });
  }
};
