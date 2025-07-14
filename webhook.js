const express = require('express');
const fs = require('fs');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/webhook', async (req, res) => {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}]`;

  console.log(`${log} 📥 Webhook recebido`);
  res.status(200).send('OK');
  fs.appendFileSync('webhook.log', `${log} 📨 Conteúdo:\n${JSON.stringify(req.body, null, 2)}\n`);

  const { evento, pagamento } = req.body;
  const eventosValidos = ['PAGAMENTO_RECEBIDO', 'PAGAMENTO_CONFIRMADO'];

  if (!eventosValidos.includes(evento)) {
    fs.appendFileSync('webhook.log', `${log} ⚠️ Evento ignorado: ${evento}\n`);
    return;
  }

  const statusPagamento = (pagamento?.status || '').toUpperCase();
  if (statusPagamento !== 'RECEBIDO') {
    fs.appendFileSync('webhook.log', `${log} ⚠️ Status inesperado: ${statusPagamento}\n`);
    return;
  }

  const idCliente = pagamento?.cliente;
  const vendedor = buscarVendedor(idCliente);

  if (!vendedor) {
    fs.appendFileSync('webhook.log', `${log} ❌ Vendedor não localizado para o ID: ${idCliente}\n`);
    return;
  }

  aprovarVendedor(idCliente);
  fs.appendFileSync('webhook.log', `${log} ✅ Vendedor aprovado: ${vendedor.nome} (${vendedor.email})\n`);

  try {
    const resultado = await registrarVendedor(vendedor);
    fs.appendFileSync('webhook.log', `${log} 🎉 Criado no Multvendor:\n${JSON.stringify(resultado, null, 2)}\n`);
  } catch (erro) {
    fs.appendFileSync('webhook.log', `${log} ❌ Falha no registro:\n${JSON.stringify(erro?.response?.data || erro, null, 2)}\n`);
  }
});

module.exports = router;
