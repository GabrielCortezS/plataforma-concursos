// routes/cargoRoutes.js
// --------------------------------------------------------------
// ROTAS DE CARGOS
// Protegidas com JWT
// --------------------------------------------------------------

import express from "express";
import { autenticar } from "../middlewares/authMiddleware.js";

import {
  criarCargo,
  listarCargos,
  listarCargoById,
  listarCargosPorConcurso,
  atualizarCargo,
  deletarCargo
} from "../controllers/cargoController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ROTAS DE CARGOS
|--------------------------------------------------------------------------
*/

// Criar cargo
router.post("/", autenticar, criarCargo);

// Listar todos os cargos
router.get("/", autenticar, listarCargos);

// 🔵 Listar cargos por concurso específico (NOVO)
router.get("/concurso/:concursoId", autenticar, listarCargosPorConcurso);

// Listar cargo por ID
router.get("/:id", autenticar, listarCargoById);

// Atualizar cargo
router.put("/:id", autenticar, atualizarCargo);

// Deletar cargo
router.delete("/:id", autenticar, deletarCargo);

export default router;
