import express from "express";
import { registrar, login, listarAdmins } from "../controllers/authController.js";
import { autenticar } from "../middlewares/authMiddleware.js";
const router = express.Router();

// Registrar novo admin
router.post("/registrar", registrar);

// Login
router.post("/login", login);

//Listar administradores (rota protegida)
router.get("/admins", autenticar, listarAdmins);
export default router;
