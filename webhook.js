const express = require('express');
const router = express.Router();
const fs = require('fs');
const {
  aprovarVendedor,
  buscarVendedor,
  recuperarIdPorAssinaturaOuLink
} = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/', async (req, res) => {
  const timestamp = new Date().toISOString();
  const logPrefix = `[${timestamp}]`;
  console.log(`${logPrefix} 📥 Webhook recebido`);
  const bodyLog = JSON.stringify(req.body, null, 2);
  fs.appendFileSync('webhook.log', `${logPrefix} 📦 Corpo recebido:\n${bodyLog}\n`);
  res.status(200).send('OK');

  const evento = req.body?.evento ?? req.body?.event ?? null;
  const pagamento = req.body?.pagamento ?? req.body?.payment ?? null;
  let idCliente = pagamento?.cliente ?? pagamento?.customer ?? null;
  const assinatura = pagamento?.assinatura;
  const paymentLink = pagamento?.paymentLink;
  const status = typeof pagamento?.status === 'string' ? pagamento.status.toUpperCase() : null;

  if (evento !== 'PAGAMENTO_CONFIRMADO' && evento !== 'PAYMENT_CONFIRMED') return;

  if (status !== 'CONFIRMADO' && status !== 'CONFIRMED') return;

  if (!idCliente && (assinatura || paymentLink)) {
    idCliente = recuperarIdPorAssinaturaOuLink(assinatura, paymentLink);
    if (!idCliente) return;
  }

  const vendedor = buscarVendedor(idCliente);
  if (!vendedor) return;

  aprovarVendedor(idCliente);
  try {
    const resultado = await registrarVendedor(vendedor);
    fs.appendFileSync('webhook.log', `${logPrefix} 🎉 Vendedor criado:\n${JSON.stringify(resultado, null, 2)}\n`);
  } catch (erro) {
    const dadosErro = erro?.response?.data || erro;
    fs.appendFileSync('webhook.log', `${logPrefix} ❌ Erro:\n${JSON.stringify(dadosErro, null, 2)}\n`);
  }
});

module.exports = router;
