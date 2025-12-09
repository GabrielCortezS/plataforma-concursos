// src/routes/inscricaoRoutes.js

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
  downloadComprovanteAdmin,
} from "../controllers/inscricaoController.js";

const router = express.Router();

/* =============================
   ROTAS DO CANDIDATO
============================= */

router.post("/", autenticar, uploadFotoCandidato.single("foto"), criarInscricao);

router.get("/minhas", autenticar, listarMinhasInscricoes);

router.get("/minha/:id", autenticar, buscarInscricaoDoCandidato);

router.get("/comprovante/:id", autenticar, downloadComprovanteCandidato);

/* =============================
   ROTAS DO ADMIN
============================= */

router.get("/admin", autenticar, verificarAdmin, listarInscricoes);

router.get("/foto/:id", autenticar, verificarAdmin, downloadFoto);

router.get("/admin/:id", autenticar, verificarAdmin, buscarInscricaoPorId);

router.get(
  "/comprovante/admin/:id",
  autenticar,
  verificarAdmin,
  downloadComprovanteAdmin
);

router.put(
  "/admin/:id",
  autenticar,
  verificarAdmin,
  uploadFotoCandidato.single("foto"),
  atualizarInscricao
);

router.delete("/admin/:id", autenticar, verificarAdmin, deletarInscricao);

export default router;
