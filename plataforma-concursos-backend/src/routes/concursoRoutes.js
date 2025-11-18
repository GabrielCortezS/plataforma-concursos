import express from "express";
import {
  criarConcurso,
  listarConcursos,
  atualizarConcurso,
  deletarConcurso,
  buscarConcursoPorId,
} from "../controllers/concursoController.js";
import { autenticar } from "../middlewares/authMiddleware.js";
import { uploadDocumentos } from "../middlewares/uploadDocumentos.js";

const router = express.Router();

 // Rotas protegidas por autenticação (JWT)
 // Rota para criar concurso (precisa de token de admin) e Enviar vários arquivos: documentos[]
router.post(
  "/",
  autenticar,
  uploadDocumentos.array("documentos", 10), // até 10 arquivos
  criarConcurso
);
 //Rota para listar todos os concursos (pública por enquanto)
router.get("/", listarConcursos);
 //Buscar concurso pelo ID (público por enquanto)
router.get("/:id", buscarConcursoPorId);
// Atualizar concurso → precisa de token
router.put(
  "/:id",
  autenticar,                                // login obrigatório
  uploadDocumentos.array("documentos", 10),  // ESSENCIAL para receber arquivos
  atualizarConcurso
);
// Deletar concurso → precisa de token
router.delete("/:id", autenticar, deletarConcurso);



export default router;
