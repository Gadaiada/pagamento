const express = require('express');
const fs = require('fs');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/webhook', async (req, res) => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}]`;

  // 📥 Confirma recebimento do webhook
  console.log(`${logPrefix} 📥 Webhook recebido`);
  res.status(200).send('OK');

  // 📨 Exibe corpo completo no log
  const bodyLog = JSON.stringify(req.body, null, 2);
  console.log(`${logPrefix} 📨 Conteúdo recebido:\n${bodyLog}`);
  fs.appendFileSync('webhook.log', `${logPrefix} 📨 Conteúdo recebido:\n${bodyLog}\n`);

  const { evento, pagamento } = req.body;

  // 🎯 Só aceita evento PAGAMENTO_CONFIRMADO
  if (evento !== 'PAGAMENTO_CONFIRMADO') {
    console.log(`${logPrefix} ⚠️ Evento ignorado: ${evento}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ⚠️ Evento ignorado: ${evento}\n`);
    return;
  }

  // 🔒 Só continua se o status do pagamento for CONFIRMADO
  const status = (pagamento?.status || '').toUpperCase();
  if (status !== 'CONFIRMADO') {
    console.log(`${logPrefix} ⚠️ Pagamento com status inesperado: ${status}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ⚠️ Pagamento com status inesperado: ${status}\n`);
    return;
  }

  const idCliente = pagamento?.cliente;
  if (!idCliente) {
    console.log(`${logPrefix} ⚠️ Cliente não identificado no pagamento`);
    fs.appendFileSync('webhook.log', `${logPrefix} ⚠️ Cliente não identificado no pagamento\n`);
    return;
  }

  console.log(`${logPrefix} 🔎 Buscando vendedor com ID: ${idCliente}`);
  const vendedor = buscarVendedor(idCliente);

  if (!vendedor) {
    console.log(`${logPrefix} ❌ Nenhum vendedor temporário encontrado`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Nenhum vendedor temporário encontrado para ID: ${idCliente}\n`);
    return;
  }

  aprovarVendedor(idCliente);
  console.log(`${logPrefix} ✅ Vendedor aprovado: ${vendedor.nome} (${vendedor.email})`);
  fs.appendFileSync('webhook.log', `${logPrefix} ✅ Vendedor aprovado: ${vendedor.nome} (${vendedor.email})\n`);

  // 🔐 Criação automática no Multvendor
  try {
    const resultado = await registrarVendedor(vendedor);
    console.log(`${logPrefix} 🎉 Vendedor criado no Multvendor!`);
    console.log(`${logPrefix} 🧾 Resposta da API:\n${JSON.stringify(resultado, null, 2)}`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🎉 Vendedor criado no Multvendor:\n${JSON.stringify(resultado, null, 2)}\n`);
  } catch (erro) {
    console.error(`${logPrefix} ❌ Erro ao criar vendedor:`, erro?.response?.data || erro);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Erro ao criar vendedor:\n${JSON.stringify(erro?.response?.data || erro, null, 2)}\n`);
  }
});

module.exports = router;
