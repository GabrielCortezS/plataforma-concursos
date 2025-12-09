// src/routes/cargoRoutes.js
import express from "express";
import {
  criarCargo,
  listarCargos,
  listarCargoPorId,
  atualizarCargo,
  deletarCargo
} from "../controllers/cargoController.js";

import Cargo from "../models/Cargo.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| 📌 Buscar cargos de um concurso específico
| GET /api/cargos/concurso/:id
|--------------------------------------------------------------------------
| - Usado na tela de inscrição do candidato
| - Só retorna cargos vinculados ao concurso escolhido
|--------------------------------------------------------------------------
*/
router.get("/concurso/:id", async (req, res) => {
  try {
    const concursoId = req.params.id;

    const cargos = await Cargo.find({ concursoId });

    return res.json({ cargos });
  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao buscar cargos do concurso",
      erro: error.message,
    });
  }
});

/*
|--------------------------------------------------------------------------
| CRUD PADRÃO DO ADMIN
|--------------------------------------------------------------------------
*/

router.post("/", criarCargo);
router.get("/", listarCargos);
router.get("/:id", listarCargoPorId);
router.put("/:id", atualizarCargo);
router.delete("/:id", deletarCargo);

export default router;
