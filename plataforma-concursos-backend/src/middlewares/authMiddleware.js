import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const autenticar = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o token foi enviado
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decodifica token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Salva o usuário dentro da requisição (universal)
    // Aqui vai conter: id, tipo (ex: "admin"), exp, iat
    req.usuario = decoded;

    // SE for administrador, verifica se ele existe no banco
    if (decoded.tipo === "admin") {
      const admin = await Admin.findById(decoded.id).select("-senha");

      if (!admin) {
        return res.status(404).json({ mensagem: "Administrador não encontrado" });
      }

      req.usuario.dados = admin; // guarda os dados do admin
    }

    // OBS:
    // Se no futuro tivermos candidato logado,
    // basta adicionar validação opcional aqui.

    next();

  } catch (error) {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
};
