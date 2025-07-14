const express = require('express');
const fs = require('fs');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/webhook', async (req, res) => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}]`;
  const { evento, pagamento } = req.body;
  const idCliente = pagamento?.cliente;
  const status = (pagamento?.status || '').toUpperCase();

  console.log(`${logPrefix} 📥 Webhook recebido: Evento = ${evento}, Status = ${status}, Cliente = ${idCliente}`);
  fs.appendFileSync('webhook.log', `${logPrefix} 📨 Webhook recebido:\n${JSON.stringify(req.body, null, 2)}\n`);

  res.status(200).send('OK');

  if (evento !== 'PAGAMENTO_CONFIRMADO') {
    console.log(`${logPrefix} ⚠️ Evento ignorado: ${evento}`);
    return;
  }

  if (status !== 'CONFIRMADO') {
    console.log(`${logPrefix} ⚠️ Status ignorado: ${status}`);
    return;
  }

  if (!idCliente) {
    console.log(`${logPrefix} ❌ Cliente não encontrado no webhook`);
    return;
  }

  const vendedor = buscarVendedor(idCliente);
  if (!vendedor) {
    console.log(`${logPrefix} ❌ Vendedor não localizado para cliente ${idCliente}`);
    return;
  }

  aprovarVendedor(idCliente);
  console.log(`${logPrefix} ✅ Vendedor temporário aprovado: ${vendedor.nome} (${vendedor.email})`);

  try {
    const resultado = await registrarVendedor(vendedor);
    console.log(`${logPrefix} 🎉 Vendedor criado com sucesso:\n${JSON.stringify(resultado, null, 2)}`);
  } catch (erro) {
    console.error(`${logPrefix} ❌ Erro ao criar vendedor:\n`, erro?.response?.data || erro);
  }
});

module.exports = router;
