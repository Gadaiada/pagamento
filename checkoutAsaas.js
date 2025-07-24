const axios = require('axios');
const { salvarVendedorTemporario } = require('./armazenamentoVendedor');

async function criarAssinaturaMensal(v) {
  try {
    console.log('[checkout] 🔄 Iniciando criação do cliente...');
    const cliente = await axios.post('https://sandbox.asaas.com/api/v3/customers', {
      name: v.nome,
      email: v.email,
      phone: v.telefone
    }, {
      headers: { access_token: process.env.ASAAS_TOKEN }
    });
    console.log('[checkout] ✅ Cliente criado:', cliente.data.id);

    console.log('[checkout] 🔄 Criando assinatura...');
    const assinatura = await axios.post('https://sandbox.asaas.com/api/v3/subscriptions', {
      customer: cliente.data.id,
      billingType: 'CREDIT_CARD',
      value: 45,
      cycle: 'MONTHLY',
      description: 'Assinatura mensal Webskull Marketplace'
    }, {
      headers: { access_token: process.env.ASAAS_TOKEN }
    });
    console.log('[checkout] ✅ Assinatura criada:', assinatura.data.id);

    console.log('[checkout] 💾 Salvando vendedor temporário...');
    salvarVendedorTemporario(cliente.data.id, {
      nome: v.nome,
      email: v.email,
      telefone: v.telefone,
      assinatura: assinatura.data.id,
      paymentLink: assinatura.data.paymentLink
    });

    return assinatura.data;
  } catch (err) {
    console.error('[checkout] ❌ Erro:', err?.response?.data || err.message);
    throw err;
  }
}

module.exports = { criarAssinaturaMensal };
