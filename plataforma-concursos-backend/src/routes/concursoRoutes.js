// src/routes/concursoRoutes.js
import express from "express";
import {
  criarConcurso,
  listarConcursos,
  atualizarConcurso,
  deletarConcurso,
  buscarConcursoPorId,
  downloadDocumento
} from "../controllers/concursoController.js";

import { autenticar } from "../middlewares/authMiddleware.js";
import { verificarAdmin } from "../middlewares/verificarAdmin.js";
import { uploadDocumentos } from "../middlewares/uploadDocumentos.js";

const router = express.Router();

/*
|----------------------------------------------------------------------
| ADMIN — Criar concurso (com PDF + imagens)
|----------------------------------------------------------------------
*/
router.post(
  "/",
  autenticar,
  verificarAdmin,
  uploadDocumentos, // ✔ agora correto
  criarConcurso
);

/*
|----------------------------------------------------------------------
| PÚBLICO — Listagem e visualização
|----------------------------------------------------------------------
*/
router.get("/", listarConcursos);
router.get("/:id", buscarConcursoPorId);

/*
|----------------------------------------------------------------------
| ADMIN — Atualizar concurso (com novos arquivos)
|----------------------------------------------------------------------
*/
router.put(
  "/:id",
  autenticar,
  verificarAdmin,
  uploadDocumentos, // ✔ removeu .array()
  atualizarConcurso
);

/*
|----------------------------------------------------------------------
| ADMIN — Deletar concurso
|----------------------------------------------------------------------
*/
router.delete("/:id", autenticar, verificarAdmin, deletarConcurso);

/*
|----------------------------------------------------------------------
| DOWNLOAD DE DOCUMENTOS (PDF/IMAGENS)
|----------------------------------------------------------------------
*/
router.get("/download/:arquivo", downloadDocumento);

export default router;
