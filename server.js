const fastify = require('fastify')({ logger: true });
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

require('dotenv').config();



// Configurações para enviar e-mail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME, // Carrega o nome de usuário do ambiente
    pass: process.env.MAIL_PASSWORD // Carrega a senha do ambiente
  }
});
// Função para enviar e-mail
async function enviarEmail(destinatario, assunto, mensagem) {
  try {
    await transporter.sendMail({
      from: "felipejsf7@gmail.com", // Carrega o remetente padrão do ambiente
      to: destinatario,
      subject: assunto,
      text: mensagem
    });
    return true;
  } catch (error) {
    console.log(process.env.MAIL_PASSWORD)
    console.error("Erro ao enviar e-mail:", error);
    return false;
  }
}

// Rota para enviar e-mail via API
fastify.post('/enviar-email', async (request, reply) => {
  const { destinatario, assunto, mensagem } = request.body;


  if (!destinatario || !assunto || !mensagem) {
    return reply.code(400).send({ status: 'error', message: 'Parâmetros inválidos' });
  }

  if (await enviarEmail(destinatario, assunto, mensagem)) {
    return reply.redirect('/email-enviado');
    //return { status: 'success', message: 'E-mail enviado com sucesso!' };
  } else {
        console.log(process.env.MAIL_PASSWORD)

    return reply.code(500).send({ status: 'error', message: 'Erro ao enviar e-mail.' });
  }
});

// Rota de exemplo
fastify.get('/', async (request, reply) => {
  try {
    // Caminho para a página HTML (assumindo que está na mesma raiz que o arquivo principal)
    const htmlPath = path.join(__dirname, 'pesquisa.html');
    
    // Verifica se o arquivo HTML existe
    if (!fs.existsSync(htmlPath)) {
      return reply.code(404).send('Página não encontrada');
    }
    
    // Carrega o conteúdo do arquivo HTML
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Envia a página HTML como resposta
    reply.type('text/html').send(htmlContent);
  } catch (error) {
    // Se houver algum erro ao carregar o arquivo HTML, envie uma resposta de erro
    reply.code(500).send('Erro ao carregar a página HTML');
  }
});

fastify.get('/email-enviado', async (request, reply) => {
  try {
    // Caminho para a página HTML (assumindo que está na mesma raiz que o arquivo principal)
    const htmlPath = path.join(__dirname, 'email-enviado.html');
    
    // Verifica se o arquivo HTML existe
    if (!fs.existsSync(htmlPath)) {
      return reply.code(404).send('Página não encontrada');
    }
    
    // Carrega o conteúdo do arquivo HTML
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Envia a página HTML como resposta
    reply.type('text/html').send(htmlContent);
  } catch (error) {
    // Se houver algum erro ao carregar o arquivo HTML, envie uma resposta de erro
    reply.code(500).send('Erro ao carregar a página HTML');
  }
});



// Inicia o servidor
fastify.listen(process.env.PORT || 3000, '0.0.0.0', (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Servidor ouvindo em ${address}`);
});
