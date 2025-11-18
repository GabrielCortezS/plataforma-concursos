export const verificarAdmin = (req, res, next) => {
    // Verifica se o usuário está autenticado
    if (!req.usuario) {
        return res.status(401).json({
            mensagem: "Não autenticado"
        });
    }

    // Verifica se o tipo do usuário é admin
    if (req.usuario.tipo !== "admin") {
        return res.status(403).json({
            mensagem: "Acesso negado: somente administradores podem acessar esta rota"
        });
    }

    next();
};
