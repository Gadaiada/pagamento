const express = require('express');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');


router.post('/webhook', (req, res) => {
  try {
    const { event, payment } = req.body;

    console.log('Evento recebido do Asaas:', event);

    // ✅ Sempre responde rapidamente ao Asaas
    res.status(200).send('OK');

    if (event === 'PAYMENT_CONFIRMED') {
      const clienteId = payment.customer;
      console.log('ID do cliente recebido no webhook:', clienteId);

      aprovarVendedor(clienteId);

      const vendedor = buscarVendedor(clienteId);

      if (vendedor) {
        console.log(`Pagamento confirmado. Vendedor aprovado: ${vendedor.nome}`);
      } else {
        console.log(`Pagamento confirmado, mas vendedor não encontrado na memória. ID: ${clienteId}`);
      }
    }
  } catch (err) {
    console.error('Erro ao processar webhook:', err.message);
    // Mesmo em erro, responder com 200 evita novo 408
    res.status(200).send('Erro interno, mas recebido');
  }
});

module.exports = router;
