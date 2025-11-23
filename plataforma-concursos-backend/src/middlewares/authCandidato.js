// src/middlewares/authCandidato.js
import jwt from "jsonwebtoken";

/*
|--------------------------------------------------------------------------
| 🛡 Middleware: Autentica Candidato
|-------------------------------------------------------------------------
| - Verifica se token foi enviado no header Authorization
| - Valida o token JWT
| - Anexa os dados decodificados à requisição (req.user)
|--------------------------------------------------------------------------
*/

export default function authCandidato(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer token"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Token inválido" });
  }
}
