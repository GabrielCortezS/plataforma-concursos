import express from "express";
import authCandidato from "../middlewares/authCandidato.js";
import { meusDados } from "../controllers/candidatoController.js";

const router = express.Router();

router.get("/me", authCandidato, meusDados);

export default router;
