import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

/*
|------------------------------------------------------------
| 🔥 Função para gerar token JWT
| - Inclui o ID do admin
| - Inclui o tipo de usuário ("admin")
| - Duração: 7 dias
|------------------------------------------------------------
*/
const gerarToken = (id) => {
    return jwt.sign(
        {
            id,
            tipo: "admin" // 🔥 Essencial para validações futuras
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};

/*
|------------------------------------------------------------
| 🟩 Registrar novo administrador
|------------------------------------------------------------
*/
export const registrar = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // 🔍 Verifica se email já está cadastrado
        const adminExistente = await Admin.findOne({ email });
        if (adminExistente) {
            return res.status(400).json({ mensagem: "Email já cadastrado" });
        }

        // 🆕 Cria o admin
        const novoAdmin = await Admin.create({ nome, email, senha });

        // ✔ Retorna token diretamente
        return res.status(201).json({
            mensagem: "Administrador criado com sucesso",
            token: gerarToken(novoAdmin._id),
            email: novoAdmin.email,
            nome: novoAdmin.nome
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao registrar admin",
            erro: error.message
        });
    }
};

/*
|------------------------------------------------------------
| 🟦 Listar todos os administradores (senha removida)
|------------------------------------------------------------
*/
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

/*
|------------------------------------------------------------
| 🟥 Login do administrador
|------------------------------------------------------------
| IMPORTANTE:
| - Futuramente adicionar comparação de senha com bcrypt
| - O frontend depende de retornar email + nome aqui
|------------------------------------------------------------
*/
export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 🔍 Verifica se existe admin com o email
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({
                mensagem: "Credenciais inválidas"
            });
        }

        /*
        |------------------------------------------------------------
        | 🔐 Validação de senha
        | (Ativar quando bcrypt estiver configurado)
        |------------------------------------------------------------
        */
        // if (!(await admin.compararSenha(senha))) {
        //   return res.status(400).json({ mensagem: "Senha incorreta" });
        // }

        /*
        |------------------------------------------------------------
        | ✔ Retorno completo do login:
        | - token JWT
        | - email do admin
        | - nome do admin
        |------------------------------------------------------------
        */
        return res.json({
            mensagem: "Login realizado com sucesso",
            token: gerarToken(admin._id),
            email: admin.email, // 🌟 NECESSÁRIO para o AdminHeader
            nome: admin.nome     // 🌟 Podemos usar futuramente
        });

    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao realizar login",
            erro: error.message
        });
    }
};
