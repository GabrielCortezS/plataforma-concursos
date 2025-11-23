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
|--------------------------------------------------------------------------
| ADMIN — Criar concurso com upload de documentos
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  autenticar,
  verificarAdmin,
  uploadDocumentos.array("documentos", 10),
  criarConcurso
);

/*
|--------------------------------------------------------------------------
| PÚBLICO — Listar e ver detalhes de concursos
|--------------------------------------------------------------------------
*/
router.get("/", listarConcursos);
router.get("/:id", buscarConcursoPorId);

/*
|--------------------------------------------------------------------------
| ADMIN — Atualizar concurso (troca documentos)
|--------------------------------------------------------------------------
*/
router.put(
  "/:id",
  autenticar,
  verificarAdmin,
  uploadDocumentos.array("documentos", 10),
  atualizarConcurso
);

/*
|--------------------------------------------------------------------------
| ADMIN — Deletar concurso
|--------------------------------------------------------------------------
*/
router.delete("/:id", autenticar, verificarAdmin, deletarConcurso);

/*
|--------------------------------------------------------------------------
| Download de documentos do concurso (PDF, imagens)
|--------------------------------------------------------------------------
*/
router.get("/download/:arquivo", downloadDocumento);

export default router;
