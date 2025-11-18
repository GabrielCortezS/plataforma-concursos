import express from "express";
import { autenticar } from "../middlewares/authMiddleware.js";
import {
  criarCargo,
  listarCargos,
  listarCargoById,
  atualizarCargo,
  deletarCargo
} from "../controllers/cargoController.js";



const router = express.Router();

// Criar cargo
router.post("/", autenticar, criarCargo);

// Listar todos os cargos
router.get("/", autenticar, listarCargos);

// Listar cargo por ID
router.get("/:id", autenticar, listarCargoById);

// Atualizar cargo
router.put("/:id", autenticar, atualizarCargo);

// Deletar cargo
router.delete("/:id", autenticar, deletarCargo);

export default router;
