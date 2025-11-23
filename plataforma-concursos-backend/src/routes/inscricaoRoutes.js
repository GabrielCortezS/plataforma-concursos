// src/routes/inscricaoRoutes.js
// Rotas responsáveis pela criação e gestão das inscrições

import express from "express";
import { autenticar } from "../middlewares/authMiddleware.js";
import {verificarAdmin} from "../middlewares/verificarAdmin.js"
import { uploadFotoCandidato } from "../middlewares/uploadFotoCandidato.js";

import {
  criarInscricao,
  listarInscricoes,
  listarMinhasInscricoes,
  buscarInscricaoPorId,
  atualizarInscricao,
  deletarInscricao,
  downloadFoto,
} from "../controllers/inscricaoController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| 📌 ROTAS DO CANDIDATO
|--------------------------------------------------------------------------
*/

/*
|---------------------------------------------------------
| Criar inscrição
| - Apenas candidato logado
| - Envia foto 3x4
|---------------------------------------------------------
*/
router.post(
  "/",
  autenticar,                        // precisa estar logado
  uploadFotoCandidato.single("foto"), // upload da foto
  criarInscricao
);

/*
|---------------------------------------------------------
| Listar inscrições do candidato logado
|---------------------------------------------------------
*/
router.get("/minhas", autenticar, listarMinhasInscricoes);

/*
|--------------------------------------------------------------------------
| 📌 ROTAS DO ADMIN
|-------------------------------------------------------------------------- 
*/

/*
|---------------------------------------------------------
| Listar todas as inscrições
|---------------------------------------------------------
*/
router.get("/", autenticar, verificarAdmin, listarInscricoes);

/*
|---------------------------------------------------------
| Download da foto do candidato
| ⚠ Importante: essa rota deve vir ANTES de "/:id"
|---------------------------------------------------------
*/
router.get("/foto/:id", autenticar, verificarAdmin, downloadFoto);

/*
|---------------------------------------------------------
| Buscar inscrição por ID
|---------------------------------------------------------
*/
router.get("/:id", autenticar, verificarAdmin, buscarInscricaoPorId);

/*
|---------------------------------------------------------
| Atualizar inscrição
|---------------------------------------------------------
*/
router.put("/:id", autenticar, verificarAdmin, atualizarInscricao);

/*
|---------------------------------------------------------
| Deletar inscrição
|---------------------------------------------------------
*/
router.delete("/:id", autenticar, verificarAdmin, deletarInscricao);

export default router;
