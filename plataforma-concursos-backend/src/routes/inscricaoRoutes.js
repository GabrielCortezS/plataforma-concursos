import express from "express";
import {
  criarInscricao,
  listarInscricoes,
  buscarInscricaoPorId,
  atualizarInscricao,
  deletarInscricao,
  downloadFoto
} from "../controllers/inscricaoController.js";

import { upload } from "../middlewares/upload.js";
import { autenticar } from "../middlewares/authMiddleware.js";
import { verificarAdmin } from "../middlewares/verificarAdmin.js";

const router = express.Router();

/*
|---------------------------------------------------------------------
| ROTAS DE INSCRIÇÃO
|---------------------------------------------------------------------
*/

// Criar inscrição (pública) + upload da foto
router.post("/", upload.single("foto"), criarInscricao);

// Listar todas as inscrições (somente ADMIN)
router.get("/", autenticar, verificarAdmin, listarInscricoes);

// Download da foto do candidato (somente ADMIN)
router.get("/:id/foto", autenticar, verificarAdmin, downloadFoto);

// Buscar inscrição por ID (somente ADMIN)
router.get("/:id", autenticar, verificarAdmin, buscarInscricaoPorId);

// Atualizar inscrição (somente ADMIN)
router.put("/:id", autenticar, verificarAdmin, upload.single("foto"), atualizarInscricao);

// Deletar inscrição (somente ADMIN)
router.delete("/:id", autenticar, verificarAdmin, deletarInscricao);

export default router;
