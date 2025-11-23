// src/controllers/contatoController.js
// Controlador responsável por receber mensagens do formulário de contato
// e enviá-las para o e-mail do administrador usando Nodemailer.

import nodemailer from "nodemailer";

/*
|--------------------------------------------------------------------------
| 📩 Enviar Mensagem de Contato
|--------------------------------------------------------------------------
*/
export const enviarContato = async (req, res) => {
  try {
    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos.",
      });
    }

    // Configuração do transporte SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // Gmail/Outlook usam STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Conteúdo do e-mail
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_TO, // Admin recebe
      subject: `📩 Nova mensagem de contato - INEPAS`,
      html: `
        <h2>Nova mensagem de contato</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
        <br>
        <small>Enviado automaticamente pelo sistema INEPAS.</small>
      `,
    };

    // Envia o e-mail
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      mensagem: "Mensagem enviada com sucesso!",
    });

  } catch (error) {
    return res.status(500).json({
      mensagem: "Erro ao enviar mensagem.",
      erro: error.message,
    });
  }
};
