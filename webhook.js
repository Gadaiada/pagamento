const express = require('express');
const router = express.Router();
const fs = require('fs');
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/', async (req, res) => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}]`;

  // 📥 Log completo do corpo da requisição
  console.log(`${logPrefix} 📥 Webhook recebido`);
  const bodyLog = JSON.stringify(req.body, null, 2);
  console.log(`${logPrefix} 📦 Corpo recebido:\n${bodyLog}`);
  fs.appendFileSync('webhook.log', `${logPrefix} 📦 Corpo recebido:\n${bodyLog}\n`);

  res.status(200).send('OK');

  // 🔎 Extração segura dos dados
  const evento = req.body?.evento;
  const pagamento = req.body?.pagamento;
  const idCliente = pagamento?.cliente;
  const status = (pagamento?.status || '').toUpperCase();

  console.log(`${logPrefix} 🔍 Dados extraídos: Evento = ${evento || '[vazio]'}, Status = ${status || '[vazio]'}, Cliente = ${idCliente || '[vazio]'}`);

  // ✅ Fluxo exclusivo para PAGAMENTO_CONFIRMADO com status CONFIRMADO
  if (!evento) {
    console.log(`${logPrefix} ⚠️ Evento ausente`);
    fs.appendFileSync('webhook.log', `${logPrefix} ⚠️ Evento ausente\n`);
    return;
  }

  if (evento !== 'PAGAMENTO_CONFIRMADO') {
    console.log(`${logPrefix} ❌ Evento ignorado: ${evento}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Evento ignorado: ${evento}\n`);
    return;
  }

  if (!status) {
    console.log(`${logPrefix} ⚠️ Status de pagamento ausente`);
    fs.appendFileSync('webhook.log', `${logPrefix} ⚠️ Status de pagamento ausente\n`);
    return;
  }

  if (status !== 'CONFIRMADO') {
    console.log(`${logPrefix} ❌ Status de pagamento não é CONFIRMADO: ${status}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Status não CONFIRMADO: ${status}\n`);
    return;
  }

  if (!idCliente) {
    console.log(`${logPrefix} ❌ ID do cliente ausente`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ ID do cliente ausente\n`);
    return;
  }

  // 🔍 Buscar vendedor temporário
  const vendedor = buscarVendedor(idCliente);
  if (!vendedor) {
    console.log(`${logPrefix} ❌ Vendedor não encontrado para cliente ${idCliente}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Vendedor não encontrado para cliente ${idCliente}\n`);
    return;
  }

  // ✅ Aprovar e registrar vendedor
  aprovarVendedor(idCliente);
  console.log(`${logPrefix} ✅ Vendedor aprovado: ${vendedor.nome} (${vendedor.email})`);
  fs.appendFileSync('webhook.log', `${logPrefix} ✅ Vendedor aprovado: ${vendedor.nome} (${vendedor.email})\n`);

  try {
    const resultado = await registrarVendedor(vendedor);
    console.log(`${logPrefix} 🎉 Vendedor criado com sucesso:\n${JSON.stringify(resultado, null, 2)}`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🎉 Vendedor criado:\n${JSON.stringify(resultado, null, 2)}\n`);
  } catch (erro) {
    const respostaErro = erro?.response?.data || erro;
    const statusErro = erro?.response?.status || 'desconhecido';
    console.error(`${logPrefix} ❌ Erro ao criar vendedor: status ${statusErro}`);
    console.error(`${logPrefix} 🔎 Detalhes do erro:\n`, respostaErro);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Erro ao criar vendedor: status ${statusErro}\n`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🔎 Detalhes do erro:\n${JSON.stringify(respostaErro, null, 2)}\n`);
  }
});

module.exports = router;
