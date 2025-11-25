// src/routes/inscricaoRoutes.js
// Rotas responsáveis pela criação e gestão das inscrições

import express from "express";
import { autenticar } from "../middlewares/authMiddleware.js";
import { verificarAdmin } from "../middlewares/verificarAdmin.js";
import { uploadFotoCandidato } from "../middlewares/uploadFotoCandidato.js";

import {
  criarInscricao,
  listarInscricoes,
  listarMinhasInscricoes,
  buscarInscricaoPorId,
  atualizarInscricao,
  buscarInscricaoDoCandidato,
  deletarInscricao,
  downloadFoto,
  downloadComprovanteCandidato
} from "../controllers/inscricaoController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| 📌 ROTAS DO CANDIDATO
|--------------------------------------------------------------------------
*/

/*
|---------------------------------------------------------
| Criar nova inscrição
|---------------------------------------------------------
*/
router.post(
  "/",
  autenticar,
  uploadFotoCandidato.single("foto"),
  criarInscricao
);

/*
|---------------------------------------------------------
| Listar inscrições do candidato logado
|---------------------------------------------------------
*/
router.get("/minhas", autenticar, listarMinhasInscricoes);

/*
|---------------------------------------------------------
| Buscar UMA inscrição específica do candidato
| - utilizada para saber dados da própria inscrição
|---------------------------------------------------------
*/
router.get("/minha/:id", autenticar, buscarInscricaoDoCandidato);

/*
|--------------------------------------------------------------------------
| 📄 DOWNLOAD DO COMPROVANTE – CANDIDATO
|--------------------------------------------------------------------------
*/
router.get(
  "/comprovante/:id",
  autenticar,
  downloadComprovanteCandidato
);


/*
|--------------------------------------------------------------------------
| 📌 ROTAS DO ADMINISTRADOR
|--------------------------------------------------------------------------
*/

/*
|---------------------------------------------------------
| Listar TODAS as inscrições
|---------------------------------------------------------
*/
router.get("/", autenticar, verificarAdmin, listarInscricoes);

/*
|---------------------------------------------------------
| Download da foto enviada pelo candidato
|---------------------------------------------------------
*/
router.get("/foto/:id", autenticar, verificarAdmin, downloadFoto);

/*
|---------------------------------------------------------
| Buscar inscrição por ID (Admin)
|---------------------------------------------------------
*/
router.get("/:id", autenticar, verificarAdmin, buscarInscricaoPorId);

/*
|---------------------------------------------------------
| Atualizar inscrição (Admin)
|---------------------------------------------------------
*/
router.put(
  "/:id",
  autenticar,
  verificarAdmin,
  uploadFotoCandidato.single("foto"),
  atualizarInscricao
);

/*
|---------------------------------------------------------
| Deletar inscrição (Admin)
|---------------------------------------------------------
*/
router.delete("/:id", autenticar, verificarAdmin, deletarInscricao);

export default router;
