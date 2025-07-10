const express = require('express');
const router = express.Router();
const { aprovarVendedor, buscarVendedor } = require('./armazenamentoVendedor');
const { registrarVendedor } = require('./marketplaceService');

router.post('/webhook', async (req, res) => {
  // 🔔 Confirma recebimento do webhook
  console.log('📥 Webhook recebido');
  res.status(200).send('OK');

  // 📦 Exibe corpo completo da requisição para rastreio
  console.log('📨 Conteúdo recebido:', JSON.stringify(req.body, null, 2));

  const { event, payment } = req.body;
  const eventosValidos = ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'];

  // 🎯 Valida tipo de evento
  if (!eventosValidos.includes(event)) {
    console.log(`⚠️ Evento ignorado: ${event}`);
    return;
  }

  const id = payment?.customer;
  if (!id) {
    console.log('⚠️ ID do cliente não encontrado no pagamento');
    return;
  }

  console.log('🔎 Buscando vendedor com ID:', id);
  const vendedor = buscarVendedor(id);

  if (!vendedor) {
    console.log('❌ Nenhum vendedor temporário localizado com esse ID');
    return;
  }

  // ✅ Aprova vendedor localmente
  aprovarVendedor(id);
  console.log(`✅ Vendedor temporário aprovado: ${vendedor.nome} (${vendedor.email})`);

  // 🛠️ Tenta registrar no Multvendor
  try {
    const resultado = await registrarVendedor(vendedor);
    console.log('🎉 Vendedor criado com sucesso no Multvendor!');
    console.log('🧾 Resposta da API:', JSON.stringify(resultado, null, 2));
  } catch (erro) {
    console.error('❌ Erro ao criar vendedor no Multvendor:', {
      message: erro.message,
      response: erro?.response?.data,
      status: erro?.response?.status
    });

    if (erro?.response?.data?.errors) {
      console.error('📛 Detalhes do erro:', erro.response.data.errors);
    }
  }
});

module.exports = router;
