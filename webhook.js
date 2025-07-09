const express = require('express');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./sellerStorage');

router.post('/webhook', (req, res) => {
  try {
    const { event, payment } = req.body;

    console.log('Evento recebido do Asaas:', event);

    if (event === 'PAYMENT_CONFIRMED') {
      const clienteId = payment.customer;
      aprovarVendedor(clienteId);

      const vendedor = buscarVendedor(clienteId);
      console.log(`Pagamento confirmado. Vendedor aprovado: ${vendedor?.nome}`);
    }

    // ✅ Importante: sempre responder mesmo se o evento não for tratado
    res.status(200).send('OK');
  } catch (err) {
    console.error('Erro no webhook:', err.message);
    res.status(500).send('Erro no webhook');
  }
});

module.exports = router;
