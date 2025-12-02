// src/routes/inscricaoRoutes.js
// Rotas responsáveis pela gestão completa das inscrições

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
  downloadComprovanteCandidato,
} from "../controllers/inscricaoController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| 📌 ROTAS DO CANDIDATO
|--------------------------------------------------------------------------
*/

/*
| 🟩 Criar nova inscrição
*/
router.post(
  "/",
  autenticar,
  uploadFotoCandidato.single("foto"),
  criarInscricao
);

/*
| 🟦 Listar inscrições do candidato logado
*/
router.get("/minhas", autenticar, listarMinhasInscricoes);

/*
| 🟦 Buscar uma inscrição específica do candidato logado
*/
router.get("/minha/:id", autenticar, buscarInscricaoDoCandidato);

/*
| 📄 Download do comprovante (candidato)
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
| 🟩 Listar todas as inscrições (rota oficial para admin)
| GET /api/inscricoes/admin
*/
router.get(
  "/admin",
  autenticar,
  verificarAdmin,
  listarInscricoes
);

/*
| 🟩 Download da foto enviada pelo candidato
| GET /api/inscricoes/foto/:id
*/
router.get(
  "/foto/:id",
  autenticar,
  verificarAdmin,
  downloadFoto
);

/*
| 🟩 Buscar inscrição por ID (Admin)
| GET /api/inscricoes/admin/:id
*/
router.get(
  "/admin/:id",
  autenticar,
  verificarAdmin,
  buscarInscricaoPorId
);

/*
| 🟦 Atualizar inscrição (Admin)
*/
router.put(
  "/admin/:id",
  autenticar,
  verificarAdmin,
  uploadFotoCandidato.single("foto"),
  atualizarInscricao
);

/*
| 🟥 Deletar inscrição (Admin)
*/
router.delete(
  "/admin/:id",
  autenticar,
  verificarAdmin,
  deletarInscricao
);

export default router;
