import express from "express";
import { registrarCandidato, loginCandidato } from "../controllers/candidatoAuthController.js";
import { uploadFotoCandidato } from "../middlewares/uploadFotoCandidato.js";

const router = express.Router();

router.post("/registrar", uploadFotoCandidato.single("foto"), registrarCandidato);
router.post("/login", loginCandidato);

export default router;
