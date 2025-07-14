const express = require('express');
const fs = require('fs');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/webhook', async (req, res) => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}]`;

  // 🔔 Confirma recebimento do webhook
  console.log(`${logPrefix} 📥 Webhook recebido`);
  res.status(200).send('OK');

  const bodyLog = JSON.stringify(req.body, null, 2);
  console.log(`${logPrefix} 📨 Conteúdo recebido:\n${bodyLog}`);
  fs.appendFileSync('webhook.log', `${logPrefix} 📨 Conteúdo recebido:\n${bodyLog}\n`);

  const { event, payment } = req.body;
  const eventosValidos = ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'];

  // 🎯 Valida tipo de evento
  if (!eventosValidos.includes(event)) {
    const ignorado = `${logPrefix} ⚠️ Evento ignorado: ${event}\n`;
    console.log(ignorado);
    fs.appendFileSync('webhook.log', ignorado);
    return;
  }

  // 🛡️ Valida status do pagamento
  if (payment?.status !== 'RECEBIDO') {
    const statusMsg = `${logPrefix} ⚠️ Pagamento com status inesperado: ${payment?.status}\n`;
    console.log(statusMsg);
    fs.appendFileSync('webhook.log', statusMsg);
    return;
  }

  const id = payment?.customer;
  if (!id) {
    const noId = `${logPrefix} ⚠️ ID do cliente não encontrado\n`;
    console.log(noId);
    fs.appendFileSync('webhook.log', noId);
    return;
  }

  console.log(`${logPrefix} 🔎 Buscando vendedor com ID: ${id}`);
  const vendedor = buscarVendedor(id);

  if (!vendedor) {
    const notFound = `${logPrefix} ❌ Nenhum vendedor temporário localizado\n`;
    console.log(notFound);
    fs.appendFileSync('webhook.log', notFound);
    return;
  }

  aprovarVendedor(id);
  const aprovadoMsg = `${logPrefix} ✅ Vendedor temporário aprovado: ${vendedor.nome} (${vendedor.email})\n`;
  console.log(aprovadoMsg);
  fs.appendFileSync('webhook.log', aprovadoMsg);

  // 🛠️ Tenta registrar no Multvendor
  try {
    const resultado = await registrarVendedor(vendedor);
    const sucessoMsg = `${logPrefix} 🎉 Vendedor criado com sucesso!\n${JSON.stringify(resultado, null, 2)}\n`;
    console.log(sucessoMsg);
    fs.appendFileSync('webhook.log', sucessoMsg);
  } catch (erro) {
    const falha = {
      mensagem: erro.message,
      resposta: erro?.response?.data,
      status: erro?.response?.status
    };

    const erroMsg = `${logPrefix} ❌ Erro ao criar vendedor:\n${JSON.stringify(falha, null, 2)}\n`;
    console.error(erroMsg);
    fs.appendFileSync('webhook.log', erroMsg);

    if (erro?.response?.data?.errors) {
      const detalhes = `${logPrefix} 📛 Detalhes do erro:\n${JSON.stringify(erro.response.data.errors, null, 2)}\n`;
      console.error(detalhes);
      fs.appendFileSync('webhook.log', detalhes);
    }
  }
});

module.exports = router;
