const express = require('express');
const router = express.Router();
const fs = require('fs');
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/', async (req, res) => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}]`;

  // 📥 Log completo do corpo recebido
  console.log(`${logPrefix} 📥 Webhook recebido`);
  const bodyLog = JSON.stringify(req.body, null, 2);
  console.log(`${logPrefix} 📦 Corpo da requisição:\n${bodyLog}`);
  fs.appendFileSync('webhook.log', `${logPrefix} 📦 Corpo recebido:\n${bodyLog}\n`);

  res.status(200).send('OK');

  // 🔎 Diagnóstico: listar todas as chaves do payload
  const chaves = Object.keys(req.body);
  console.log(`${logPrefix} 🔍 Chaves do corpo recebido:`, chaves);

  // 🧠 Extração defensiva dos campos esperados
  const evento = typeof req.body.evento === 'string' ? req.body.evento : null;
  const pagamento = typeof req.body.pagamento === 'object' ? req.body.pagamento : null;
  const idCliente = pagamento?.cliente || '[indefinido]';
  const status = typeof pagamento?.status === 'string' ? pagamento.status.toUpperCase() : '[indefinido]';

  console.log(`${logPrefix} 🧪 Dados extraídos: Evento = ${evento}, Status = ${status}, Cliente = ${idCliente}`);

  // 🛑 Validações
  if (!evento) {
    console.log(`${logPrefix} ⚠️ Campo 'evento' ausente ou inválido`);
    fs.appendFileSync('webhook.log', `${logPrefix} ⚠️ Campo 'evento' ausente ou inválido\n`);
    return;
  }

  if (evento !== 'PAGAMENTO_CONFIRMADO') {
    console.log(`${logPrefix} ❌ Evento ignorado: ${evento}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Evento ignorado: ${evento}\n`);
    return;
  }

  if (!status || status !== 'CONFIRMADO') {
    console.log(`${logPrefix} ❌ Status inválido ou não CONFIRMADO: ${status}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Status inválido ou não CONFIRMADO: ${status}\n`);
    return;
  }

  if (!idCliente || idCliente === '[indefinido]') {
    console.log(`${logPrefix} ❌ Cliente não identificado no pagamento`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Cliente não identificado\n`);
    return;
  }

  // 🔍 Busca do vendedor temporário
  const vendedor = buscarVendedor(idCliente);
  if (!vendedor) {
    console.log(`${logPrefix} ❌ Vendedor temporário não localizado para cliente: ${idCliente}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Vendedor temporário ausente para ${idCliente}\n`);
    return;
  }

  console.log(`${logPrefix} ✅ Vendedor localizado: ${vendedor.nome} (${vendedor.email})`);
  fs.appendFileSync('webhook.log', `${logPrefix} ✅ Vendedor localizado: ${vendedor.nome} (${vendedor.email})\n`);

  // ✅ Aprovação e envio para Webkul
  aprovarVendedor(idCliente);
  console.log(`${logPrefix} ✅ Vendedor aprovado`);

  try {
    const resultado = await registrarVendedor(vendedor);
    console.log(`${logPrefix} 🎉 Vendedor criado:\n${JSON.stringify(resultado, null, 2)}`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🎉 Vendedor criado:\n${JSON.stringify(resultado, null, 2)}\n`);
  } catch (erro) {
    const statusErro = erro?.response?.status || 'desconhecido';
    const dadosErro = erro?.response?.data || erro;
    console.error(`${logPrefix} ❌ Erro ao criar vendedor (status ${statusErro}):`, dadosErro);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Erro ao criar vendedor: status ${statusErro}\n`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🔎 Detalhes do erro:\n${JSON.stringify(dadosErro, null, 2)}\n`);
  }
});

module.exports = router;
