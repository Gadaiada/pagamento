const axios = require('axios');
const { salvarVendedorTemporario } = require('./armazenamentoVendedor');

async function criarAssinaturaMensal(v) {
  try {
    const cliente = await axios.post('https://sandbox.asaas.com/api/v3/customers', {
      name: v.nome,
      email: v.email,
      phone: v.telefone
    }, {
      headers: { access_token: process.env.ASAAS_TOKEN }
    });

    const assinatura = await axios.post('https://sandbox.asaas.com/api/v3/subscriptions', {
      customer: cliente.data.id,
      billingType: 'CARTAO_DE_CREDITO',
      value: 45,
      cycle: 'MONTHLY',
      description: 'Assinatura mensal Webskull Marketplace'
    }, {
      headers: { access_token: process.env.ASAAS_TOKEN }
    });

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
