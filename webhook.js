const express = require('express');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/webhook', async (req, res) => {
  res.status(200).send('OK');

  const { event, payment } = req.body;
  const eventosValidos = ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'];
  if (!eventosValidos.includes(event)) return;

  const id = payment?.customer;
  const vendedor = buscarVendedor(id);
  if (!vendedor) return;

  aprovarVendedor(id);

  try {
    const resultado = await registrarVendedor(vendedor);
    console.log('✅ Vendedor criado no Multvendor:', resultado);
  } catch (erro) {
    console.error('❌ Erro ao criar vendedor:', erro.message);
  }
});

module.exports = router;
