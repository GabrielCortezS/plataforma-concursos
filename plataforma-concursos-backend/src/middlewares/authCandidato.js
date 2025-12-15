// src/middlewares/authCandidato.js
import jwt from "jsonwebtoken";

/*
|-----------------------------------------------------------------------
| 🛡 Middleware: Autenticação exclusiva de Candidato
|-----------------------------------------------------------------------
| - Verifica token JWT
| - Garante que o token é de um candidato
| - Anexa dados decodificados em req.usuario
|-----------------------------------------------------------------------
*/

export default function authCandidato(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificação opcional (caso seu token tenha "tipo")
    if (decoded.tipo && decoded.tipo !== "candidato") {
      return res.status(403).json({ mensagem: "Apenas candidatos podem acessar esta rota." });
    }

    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensagem: "Token inválido ou expirado." });
  }
}
