const express = require('express');
const router = express.Router();
const fs = require('fs');
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/', async (req, res) => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}]`;

  console.log(`${logPrefix} 📥 Webhook recebido`);
  const bodyLog = JSON.stringify(req.body, null, 2);
  console.log(`${logPrefix} 📦 Corpo recebido:\n${bodyLog}`);
  fs.appendFileSync('webhook.log', `${logPrefix} 📦 Corpo:\n${bodyLog}\n`);

  res.status(200).send('OK');

  const evento = typeof req.body.evento === 'string' ? req.body.evento : null;
  const pagamento = typeof req.body.pagamento === 'object' ? req.body.pagamento : null;
  const idCliente = pagamento?.cliente || '[indefinido]';
  const status = typeof pagamento?.status === 'string' ? pagamento.status.toUpperCase() : '[indefinido]';

  console.log(`${logPrefix} 🧪 Dados extraídos: Evento = ${evento}, Status = ${status}, Cliente = ${idCliente}`);

  if (!evento) {
    console.log(`${logPrefix} ⚠️ Campo 'evento' ausente`);
    fs.appendFileSync('webhook.log', `${logPrefix} ⚠️ Campo 'evento' ausente\n`);
    return;
  }

  if (evento !== 'PAGAMENTO_CONFIRMADO') {
    console.log(`${logPrefix} ❌ Evento ignorado: ${evento}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Evento ignorado\n`);
    return;
  }

  if (status !== 'CONFIRMADO') {
    console.log(`${logPrefix} ❌ Status inválido: ${status}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Status inválido\n`);
    return;
  }

  if (!idCliente || idCliente === '[indefinido]') {
    console.log(`${logPrefix} ❌ ID do cliente ausente`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ ID do cliente ausente\n`);
    return;
  }

  const vendedor = buscarVendedor(idCliente);
  if (!vendedor) {
    console.log(`${logPrefix} ❌ Vendedor não localizado para cliente: ${idCliente}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Vendedor não localizado\n`);
    return;
  }

  console.log(`${logPrefix} ✅ Vendedor localizado: ${vendedor.nome} (${vendedor.email})`);
  fs.appendFileSync('webhook.log', `${logPrefix} ✅ Vendedor localizado\n`);

  aprovarVendedor(idCliente);
  console.log(`${logPrefix} ✅ Vendedor aprovado`);

  try {
    const resultado = await registrarVendedor(vendedor);
    console.log(`${logPrefix} 🎉 Vendedor criado:\n${JSON.stringify(resultado, null, 2)}`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🎉 Vendedor criado\n`);
  } catch (erro) {
    const statusErro = erro?.response?.status || 'desconhecido';
    const dadosErro = erro?.response?.data || erro;
    console.error(`${logPrefix} ❌ Erro (status ${statusErro}):`, dadosErro);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Erro ao criar vendedor\n`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🔎 Detalhes:\n${JSON.stringify(dadosErro, null, 2)}\n`);
  }
});

module.exports = router;
