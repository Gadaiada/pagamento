const express = require('express');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/webhook', async (req, res) => {
  try {
    const { event, payment } = req.body;

    console.log('📩 Webhook recebido do Asaas: Evento ->', event);
    res.status(200).send('OK'); // Sempre responde 200 para evitar reenvio do Asaas

    // Eventos que indicam pagamento confirmado
    const eventosPagamento = ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'];
    if (!eventosPagamento.includes(event)) return;

    const clienteId = payment?.customer;
    if (!clienteId) {
      console.warn('⚠️ Webhook recebido sem ID de cliente');
      return;
    }

    console.log('🔎 Verificando pagamento do cliente:', clienteId);
    aprovarVendedor(clienteId); // Atualiza status do vendedor localmente

    const vendedor = buscarVendedor(clienteId);
    if (!vendedor) {
      console.warn(`⚠️ Vendedor com ID ${clienteId} não encontrado. Não será enviado ao Multvendor.`);
      return;
    }

    console.log(`✅ Pagamento confirmado. Vendedor aprovado: ${vendedor.nome} (${clienteId})`);

    try {
      const resultado = await registrarVendedor(vendedor);
      console.log('🎉 Vendedor registrado na plataforma Multvendor com sucesso:', resultado);
    } catch (erroInterno) {
      console.error('❌ Falha ao registrar vendedor no Multvendor:', erroInterno?.response?.data || erroInterno.message);
    }
  } catch (err) {
    console.error('❌ Erro inesperado ao processar webhook:', err.message);
    res.status(200).send('Erro interno, mas recebido'); // Evita erro 408 no Asaas
  }
});

module.exports = router;
