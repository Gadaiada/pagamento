const express = require('express');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./sellerStorage');

router.post('/webhook', (req, res) => {
  try {
    const { event, payment } = req.body;

    console.log('Evento recebido do Asaas:', event);

    // 👀 Verifica se é confirmação de pagamento
    if (event === 'PAYMENT_CONFIRMED') {
      const clienteId = payment.customer;
      console.log('Cliente ID recebido no webhook:', clienteId);

      aprovarVendedor(clienteId);

      const vendedor = buscarVendedor(clienteId);

      if (vendedor) {
        console.log(`Pagamento confirmado. Vendedor aprovado: ${vendedor.nome}`);
      } else {
        console.log(`Pagamento confirmado, mas vendedor não encontrado na memória. ID: ${clienteId}`);
      }
    }

    // ✅ Sempre responde ao Asaas rapidamente
    res.status(200).send('Webhook processado com sucesso');
  } catch (err) {
    console.error('Erro ao processar webhook:', err.message);
    res.status(500).send('Erro interno no servidor');
  }
});

module.exports = router;
