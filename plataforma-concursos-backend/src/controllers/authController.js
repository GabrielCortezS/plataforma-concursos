import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// 🔥 Gerar token JWT com tipo de usuário
const gerarToken = (id) => {
    return jwt.sign(
        {
            id,
            tipo: "admin" // 🔥 ESSENCIAL PARA PERMISSÕES
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d", // dura 7 dias
        }
    );
};

// Registrar novo admin
export const registrar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Verifica se já existe admin com o mesmo email
        const adminExistente = await Admin.findOne({ email });
        if (adminExistente) {
            return res.status(400).json({ mensagem: "Email já cadastrado" });
        }

        const novoAdmin = await Admin.create({ nome, email, senha });

        res.status(201).json({
            mensagem: "Administrador criado com sucesso",
            token: gerarToken(novoAdmin._id),
        });

    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao registrar admin",
            erro: error.message
        });
    }
};

// Listar todos os administradores
export const listarAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select("-senha");
        return res.json(admins);

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao listar administradores",
            erro: error.message
        });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Busca pelo email
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({
                mensagem: "Credenciais inválidas"
            });
        }

        // Aqui você deveria validar a senha com bcrypt (faremos depois)
        // if (!(await admin.compararSenha(senha))) {...}

        res.json({
            mensagem: "Login realizado com sucesso",
            token: gerarToken(admin._id),
        });

    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao realizar login",
            erro: error.message
        });
    }
};
