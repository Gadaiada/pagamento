const express = require('express');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/webhook', async (req, res) => {
  try {
    const { event, payment } = req.body;

    console.log('📩 Evento recebido do Asaas:', event);
    res.status(200).send('OK'); // Confirma recepção pro Asaas

    if (event === 'PAYMENT_CONFIRMED') {
      const clienteId = payment.customer;
      console.log('✅ ID do cliente recebido no webhook:', clienteId);

      aprovarVendedor(clienteId); // Atualiza status local

      const vendedor = buscarVendedor(clienteId);

      if (vendedor) {
        console.log(`🚀 Pagamento confirmado. Vendedor aprovado: ${vendedor.nome}`);
        try {
          const resultado = await registrarVendedor(vendedor); // Envia para a plataforma multivendor
          console.log('✅ Vendedor registrado na plataforma multivendor:', resultado);
        } catch (erroInterno) {
          console.error('❌ Erro ao enviar vendedor ao multvendedor:', erroInterno?.response?.data || erroInterno.message);
        }
      } else {
        console.warn(`⚠️ Pagamento confirmado, mas vendedor não encontrado. ID: ${clienteId}`);
      }
    }
  } catch (err) {
    console.error('❌ Erro ao processar webhook:', err.message);
    res.status(200).send('Erro interno, mas recebido'); // Evita reenvio do Asaas
  }
});

module.exports = router;
