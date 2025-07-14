const express = require('express');
const router = express.Router();
const fs = require('fs');
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/', async (req, res) => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}]`;

  // 📨 Recebendo conteúdo
  console.log(`${logPrefix} 📥 Webhook recebido`);
  const bodyLog = JSON.stringify(req.body, null, 2);
  console.log(`${logPrefix} 📦 Corpo da requisição:\n${bodyLog}`);
  fs.appendFileSync('webhook.log', `${logPrefix} 📦 Corpo recebido:\n${bodyLog}\n`);

  res.status(200).send('OK');

  // 🔎 Extração inicial
  const { evento, pagamento } = req.body;
  const idCliente = pagamento?.cliente;
  const status = (pagamento?.status || '').toUpperCase();

  console.log(`${logPrefix} 🔍 Dados extraídos: Evento = ${evento}, Status = ${status}, Cliente = ${idCliente}`);

  // 🚫 Validando evento
  if (!evento) {
    console.log(`${logPrefix} ⚠️ Evento não fornecido no webhook`);
    fs.appendFileSync('webhook.log', `${logPrefix} ⚠️ Evento ausente\n`);
    return;
  }

  if (evento !== 'PAGAMENTO_CONFIRMADO') {
    console.log(`${logPrefix} ❌ Evento ignorado: ${evento}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Evento ignorado: ${evento}\n`);
    return;
  }

  // 🚫 Validando status
  if (!status) {
    console.log(`${logPrefix} ⚠️ Status de pagamento não informado`);
    fs.appendFileSync('webhook.log', `${logPrefix} ⚠️ Status ausente\n`);
    return;
  }

  if (status !== 'CONFIRMADO') {
    console.log(`${logPrefix} ❌ Status de pagamento inesperado: ${status}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Status inesperado: ${status}\n`);
    return;
  }

  // 🚫 Validando cliente
  if (!idCliente) {
    console.log(`${logPrefix} ❌ ID de cliente não encontrado`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Cliente ausente\n`);
    return;
  }

  // 🧠 Buscando vendedor temporário
  const vendedor = buscarVendedor(idCliente);

  if (!vendedor) {
    console.log(`${logPrefix} ❌ Vendedor temporário não localizado para ID: ${idCliente}`);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Vendedor não encontrado para cliente ${idCliente}\n`);
    return;
  }

  console.log(`${logPrefix} ✅ Vendedor localizado: ${vendedor.nome} (${vendedor.email})`);
  fs.appendFileSync('webhook.log', `${logPrefix} ✅ Vendedor localizado: ${vendedor.nome} (${vendedor.email})\n`);

  // ✅ Aprovar e registrar
  aprovarVendedor(idCliente);
  console.log(`${logPrefix} ✅ Vendedor aprovado automaticamente`);

  try {
    const resultado = await registrarVendedor(vendedor);
    console.log(`${logPrefix} 🎉 Vendedor criado com sucesso:\n${JSON.stringify(resultado, null, 2)}`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🎉 Vendedor criado:\n${JSON.stringify(resultado, null, 2)}\n`);
  } catch (erro) {
    const respostaErro = erro?.response?.data || erro;
    const statusErro = erro?.response?.status || 'desconhecido';
    console.error(`${logPrefix} ❌ Erro ao criar vendedor: status ${statusErro}`);
    console.error(`${logPrefix} 🔎 Erro detalhado:\n`, respostaErro);
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Erro ao criar vendedor: status ${statusErro}\n`);
    fs.appendFileSync('webhook.log', `${logPrefix} 🔎 Erro detalhado:\n${JSON.stringify(respostaErro, null, 2)}\n`);
  }
});

module.exports = router;
