// ============================================================================
// 📌 CONTROLLER DO CANDIDATO
// Gerencia:
// - Dados do candidato logado
// - Relacionamento com inscrições
// ============================================================================

import Candidato from "../models/Candidato.js";
import Inscricao from "../models/Inscricao.js";

/*
|--------------------------------------------------------------------------
| 👤 MEUS DADOS — CANDIDATO LOGADO
|--------------------------------------------------------------------------
| Retorna:
| - Dados do candidato autenticado (sem senha)
| - Uma inscrição relacionada (caso exista)
|
| Rota:
| GET /api/candidatos/me
|
| Proteção:
| - Middleware authCandidato
|--------------------------------------------------------------------------
*/
export const meusDados = async (req, res) => {
  try {
    /*
    |----------------------------------------------------------
    | 🔐 Recupera ID do candidato a partir do token JWT
    |----------------------------------------------------------
    */
    const candidatoId = req.usuario?.id;

    if (!candidatoId) {
      return res.status(401).json({
        mensagem: "Candidato não autenticado.",
      });
    }

    /*
    |----------------------------------------------------------
    | 👤 Buscar dados do candidato (sem senha)
    |----------------------------------------------------------
    */
    const candidato = await Candidato.findById(candidatoId).select("-senha");

    if (!candidato) {
      return res.status(404).json({
        mensagem: "Candidato não encontrado.",
      });
    }

    /*
    |----------------------------------------------------------
    | 📝 Buscar inscrição do candidato (se existir)
    |----------------------------------------------------------
    | Obs:
    | - Retorna apenas uma inscrição (primeira encontrada)
    | - Para múltiplas inscrições, usar rota específica
    |----------------------------------------------------------
    */
    const inscricao = await Inscricao.findOne({ candidatoId })
      .populate("concursoId")
      .populate("cargoId");

    /*
    |----------------------------------------------------------
    | ✅ Retorno final
    |----------------------------------------------------------
    */
    return res.json({
      candidato,
      inscricao,
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao carregar dados do candidato.",
      erro: error.message,
    });
  }
};
