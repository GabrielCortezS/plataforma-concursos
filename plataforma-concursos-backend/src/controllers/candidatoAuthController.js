import Candidato from "../models/Candidato.js";
import jwt from "jsonwebtoken";

/*
|--------------------------------------------------------------------------
| 🔐 Gerar Token JWT para Candidato
|--------------------------------------------------------------------------
*/
const gerarToken = (id) => {
  return jwt.sign(
    {
      id,
      tipo: "candidato", // 🔥 ESSENCIAL PARA DIFERENCIAR ADMIN DE CANDIDATO
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // token válido por 7 dias
  );
};

/*
|--------------------------------------------------------------------------
| 📌 Registrar candidato (com upload de foto)
|--------------------------------------------------------------------------
*/
export const registrarCandidato = async (req, res) => {
  try {
    const { nome, email, cpf, senha } = req.body;

    // Verificar email duplicado
    const existeEmail = await Candidato.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({ mensagem: "E-mail já está cadastrado" });
    }

    // Verificar CPF duplicado
    const existeCPF = await Candidato.findOne({ cpf });
    if (existeCPF) {
      return res.status(400).json({ mensagem: "CPF já está cadastrado" });
    }

    /*
    |---------------------------------------------------------------
    | 📸 Foto enviada?
    | req.file vem do middleware uploadFotoCandidato.single("foto")
    |---------------------------------------------------------------
    */
    const fotoCaminho = req.file
      ? req.file.path.replace(/\\/g, "/") // normaliza caminho para Windows
      : null;

    // Criação do candidato
    const novo = await Candidato.create({
      nome,
      email,
      cpf,
      senha,
      foto: fotoCaminho, // salva foto no banco
    });

    return res.status(201).json({
      mensagem: "Conta criada com sucesso",
      token: gerarToken(novo._id),
      candidato: {
        id: novo._id,
        nome: novo.nome,
        email: novo.email,
        cpf: novo.cpf,
        foto: novo.foto,
      },
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao registrar candidato",
      erro: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| 📌 Login do candidato
|--------------------------------------------------------------------------
*/
export const loginCandidato = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar candidato por email (incluindo senha)
    const candidato = await Candidato.findOne({ email }).select("+senha");

    if (!candidato) {
      return res.status(400).json({ mensagem: "Credenciais inválidas" });
    }

    // Comparar senha digitada com hash
    const senhaCorreta = await candidato.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: "Credenciais inválidas" });
    }

    // Retornar com token JWT
    return res.json({
      mensagem: "Login realizado com sucesso",
      token: gerarToken(candidato._id),
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao realizar login",
      erro: error.message,
    });
  }
};
