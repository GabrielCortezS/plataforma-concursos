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
| 🔵 ADMIN — Criar concurso (com upload de PDF + imagens)
|--------------------------------------------------------------------------
| - Apenas admins podem criar concursos
| - UploadDocumentos gerencia anexos (PDF/imagens)
| - multipart/form-data
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  autenticar,
  verificarAdmin,
  uploadDocumentos,
  criarConcurso
);

/*
|--------------------------------------------------------------------------
| 🟢 DOWNLOAD DE DOCUMENTOS (PDF/IMAGENS)
|--------------------------------------------------------------------------
| ⚠ IMPORTANTE: ESTA ROTA PRECISA VIR ANTES DE /:id
| Caso contrário, "/download/arquivo.pdf" seria interpretado como ":id"
|--------------------------------------------------------------------------
*/
router.get("/download/:arquivo", downloadDocumento);

/*
|--------------------------------------------------------------------------
| 🌎 PÚBLICO — Listagem geral de concursos
|--------------------------------------------------------------------------
*/
router.get("/", listarConcursos);

/*
|--------------------------------------------------------------------------
| 🌎 PÚBLICO — Buscar concurso por ID
|--------------------------------------------------------------------------
| OBS: rota deve vir ANTES dos métodos PUT/DELETE do mesmo path
|--------------------------------------------------------------------------
*/
router.get("/:id", buscarConcursoPorId);

/*
|--------------------------------------------------------------------------
| 🟡 ADMIN — Atualizar concurso
|--------------------------------------------------------------------------
| - Aceita novos documentos (opcional)
| - Se houver documentos antigos, backend remove automaticamente
| - multipart/form-data
|--------------------------------------------------------------------------
*/
router.put(
  "/:id",
  autenticar,
  verificarAdmin,
  uploadDocumentos,
  atualizarConcurso
);

/*
|--------------------------------------------------------------------------
| 🔴 ADMIN — Deletar concurso
|--------------------------------------------------------------------------
| - Remove concurso e documentos anexados
| - Protegido por autenticação e tipo admin
|--------------------------------------------------------------------------
*/
router.delete("/:id", autenticar, verificarAdmin, deletarConcurso);

export default router;
