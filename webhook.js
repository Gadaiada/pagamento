const express = require('express');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('../utils/sellerStorage');

router.post('/webhook', (req, res) => {
  const { event, payment } = req.body;

  if (event === 'PAYMENT_CONFIRMED') {
    const clienteId = payment.customer;
    aprovarVendedor(clienteId);

    const vendedor = buscarVendedor(clienteId);
    console.log(`Pagamento confirmado. Vendedor aprovado: ${vendedor?.nome}`);
  }

  res.sendStatus(200);
});

module.exports = router;
