// src/routes/contatoRoutes.js
import express from "express";
import { enviarContato } from "../controllers/contatoController.js";

const router = express.Router();

// Rota para receber contato do site
router.post("/", enviarContato);

export default router;
