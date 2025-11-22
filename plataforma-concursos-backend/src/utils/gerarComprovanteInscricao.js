// src/utils/gerarComprovanteInscricao.js
// |-------------------------------------------------------------
// | Função responsável por gerar o PDF do comprovante de inscrição
// | Utiliza PDFKit + QRCode
// |-------------------------------------------------------------

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";

export async function gerarComprovanteInscricao({ inscricao, concurso, cargo }) {
  return new Promise(async (resolve, reject) => {
    try {
      /*
      |---------------------------------------------------------
      | 📁 Pasta onde os comprovantes serão salvos
      |---------------------------------------------------------
      */
      const pastaComprovantes = path.join("uploads", "comprovantes");

      // Cria a pasta caso não exista
      if (!fs.existsSync(pastaComprovantes)) {
        fs.mkdirSync(pastaComprovantes, { recursive: true });
      }

      /*
      |---------------------------------------------------------
      | 📝 Nome do arquivo PDF
      |---------------------------------------------------------
      */
      const nomeArquivo = `comprovante_${inscricao._id}.pdf`;
      const caminhoArquivo = path.join(pastaComprovantes, nomeArquivo);

      /*
      |---------------------------------------------------------
      | 🖨 Criar documento PDF
      |---------------------------------------------------------
      */
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const writeStream = fs.createWriteStream(caminhoArquivo);
      doc.pipe(writeStream);

      /*
      |---------------------------------------------------------
      | 📌 Cabeçalho com logo e nome do instituto
      |---------------------------------------------------------
      */
      const caminhoLogo = path.join("uploads", "logo", "inepas-logo.png");

      if (fs.existsSync(caminhoLogo)) {
        doc.image(caminhoLogo, 50, 40, { width: 80 });
      }

      doc
        .fontSize(14)
        .text(
          "INEPAS - Instituto Nacional de Exames e Processos de Avaliação e Seleção",
          150,
          50,
          { align: "right" }
        );

      doc.moveTo(50, 110).lineTo(545, 110).stroke();

      /*
      |---------------------------------------------------------
      | 🏷️ Título
      |---------------------------------------------------------
      */
      doc.moveDown(2);
      doc.fontSize(20).text("Comprovante de Inscrição", { align: "center" });

      doc.moveDown(0.5);
      doc.fontSize(12).text(
        "Este documento comprova a inscrição do candidato no concurso abaixo.",
        { align: "center" }
      );

      doc.moveDown(2);

      /*
      |---------------------------------------------------------
      | 📅 Dados gerais da inscrição
      |---------------------------------------------------------
      */
      const dataCriacao = inscricao.createdAt
        ? new Date(inscricao.createdAt)
        : new Date();

      doc.fontSize(12);
      doc.text(`Número da inscrição: ${inscricao.numeroInscricao}`);
      doc.text(
        `Data e hora da inscrição: ${dataCriacao.toLocaleString("pt-BR")}`
      );
      doc.moveDown();

      /*
      |---------------------------------------------------------
      | 📝 Dados do concurso
      |---------------------------------------------------------
      */
      doc.fontSize(14).text("Dados do Concurso", { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(12);
      doc.text(`Concurso: ${concurso?.titulo || "N/D"}`);
      doc.text(`Órgão: ${concurso?.orgao || "N/D"}`);
      doc.text(`Situação: ${concurso?.status || "N/D"}`);
      doc.moveDown();

      /*
      |---------------------------------------------------------
      | 🧾 Dados do cargo
      |---------------------------------------------------------
      */
      doc.fontSize(14).text("Dados do Cargo", { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(12);
      doc.text(`Cargo: ${cargo?.nome || "N/D"}`);

      if (cargo?.salario) {
        doc.text(
          `Salário: R$ ${cargo.salario.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
          })}`
        );
      }

      if (cargo?.vagas) {
        doc.text(`Número de vagas: ${cargo.vagas}`);
      }

      doc.moveDown();

      /*
      |---------------------------------------------------------
      | 👤 Dados do candidato
      |---------------------------------------------------------
      */
      doc.fontSize(14).text("Dados do Candidato", { underline: true });
      doc.moveDown(0.5);

      doc.fontSize(12);
      doc.text(`Nome completo: ${inscricao.nomeCompleto}`);
      doc.text(`CPF: ${inscricao.cpf}`);
      doc.text(`E-mail: ${inscricao.email}`);
      doc.text(`Telefone: ${inscricao.telefone}`);

      doc.moveDown();

      /*
      |---------------------------------------------------------
      | 📌 Termos
      |---------------------------------------------------------
      */
      doc.fontSize(10).text(
        "Declaro, para os devidos fins, que as informações prestadas no ato da inscrição são verdadeiras e de minha inteira responsabilidade.",
        { align: "justify" }
      );

      doc.moveDown(2);
      doc.text(
        "Este comprovante deve ser apresentado juntamente com documento oficial de identificação no dia da prova.",
        { align: "justify" }
      );

      /*
      |---------------------------------------------------------
      | 🔳 QR Code de validação
      |---------------------------------------------------------
      */
      doc.moveDown(2);

      const urlValidacao = `https://inepas.com.br/validar-inscricao/${inscricao._id}`;

      const qrCodeDataUrl = await QRCode.toDataURL(urlValidacao);
      const base64Data = qrCodeDataUrl.split(",")[1];
      const qrBuffer = Buffer.from(base64Data, "base64");

      const posY = doc.y;
      doc.image(qrBuffer, 400, posY, { width: 120 });

      doc.moveDown(6);
      doc.fontSize(8).text(
        "QR Code para validação deste comprovante.",
        400,
        posY + 125
      );

      /*
      |---------------------------------------------------------
      | ✔ Finalizar PDF e retornar caminho normalizado
      |---------------------------------------------------------
      */
      doc.end();

      writeStream.on("finish", () => {
        // Normaliza caminho para sempre usar barra "/"
        const caminhoNormalizado = caminhoArquivo.replace(/\\/g, "/");
        resolve(caminhoNormalizado);
      });

      writeStream.on("error", (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
}
