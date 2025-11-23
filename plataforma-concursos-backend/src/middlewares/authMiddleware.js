// src/middlewares/authMiddleware.js
// Middleware de autenticação universal para ADMIN e CANDIDATO

import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Candidato from "../models/Candidato.js";

export const autenticar = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  /*
  |---------------------------------------------------------
  | Verifica se o token foi enviado corretamente
  |---------------------------------------------------------
  */
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    /*
    |---------------------------------------------------------
    | Decodifica token JWT
    |  decoded → { id, tipo, iat, exp }
    |---------------------------------------------------------
    */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Armazena info decodificada para ser usada em controllers
    req.usuario = decoded;

    /*
    |---------------------------------------------------------
    | 🔐 Usuário é ADMIN?
    |---------------------------------------------------------
    */
    if (decoded.tipo === "admin") {
      const admin = await Admin.findById(decoded.id).select("-senha");

      if (!admin) {
        return res.status(404).json({
          mensagem: "Administrador não encontrado",
        });
      }

      req.usuario.dados = admin; // dados completos do admin
      return next();
    }

    /*
    |---------------------------------------------------------
    | 👤 Usuário é CANDIDATO?
    |---------------------------------------------------------
    */
    if (decoded.tipo === "candidato") {
      const candidato = await Candidato.findById(decoded.id).select("-senha");

      if (!candidato) {
        return res.status(404).json({
          mensagem: "Candidato não encontrado",
        });
      }

      req.usuario.dados = candidato; // dados completos do candidato
      return next();
    }

    /*
    |---------------------------------------------------------
    | 🚫 Tipo inválido no token
    |---------------------------------------------------------
    */
    return res.status(403).json({
      mensagem: "Tipo de usuário inválido",
    });

  } catch (error) {
    return res.status(401).json({
      mensagem: "Token inválido ou expirado",
    });
  }
};
